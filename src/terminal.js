// Shared, dependency-free terminal. The about-me repository is the source of truth.
export const normalizeCommand = command => command.trim().replace(/^\$\s*/, '').replace(/\s+/g, ' ');
export const splitCommands = command => normalizeCommand(command).split(/\s*(?:&&|&|;)\s*/).map(normalizeCommand).filter(Boolean);
export function createTerminal({ mount, commands, complete = () => [], timing = {} }) {
  const history = mount.querySelector('.terminal-history');
  const form = mount.querySelector('.terminal-form');
  const input = form.querySelector('input');
  let timer, fadeTimer, remaining = timing.historyLifetime || 30000, deadline;
  const collapse = () => { clearTimeout(fadeTimer); history.hidden = true; history.style.opacity = ''; };
  const fade = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return collapse();
    history.style.transition = `opacity ${timing.historyFade || 1500}ms`;
    history.style.opacity = '0';
    fadeTimer = setTimeout(collapse, timing.historyFade || 1500);
  };
  const schedule = () => { clearTimeout(timer); clearTimeout(fadeTimer); history.style.opacity = ''; remaining = timing.historyLifetime || 30000; deadline = Date.now() + remaining; if (!document.hidden) timer = setTimeout(fade, remaining); };
  const append = line => {
    const row = document.createElement('div'); row.className = 'terminal-line';
    if (typeof line === 'string') row.textContent = line;
    else if (line.href) { const a = document.createElement('a'); a.textContent = line.text; a.href = line.href; row.append(a); }
    else row.textContent = `${line.name.padEnd(line.width || 0)} - ${line.text}`;
    history.append(row);
  };
  const runCommand = async raw => {
    history.hidden = false;
    for (const command of splitCommands(raw)) {
      if (command === 'clear') { history.replaceChildren(); continue; }
      append(`$ ${command}`);
      try { const result = commands(command); const lines = result?.then ? await result : result; for (const line of lines || []) append(line); }
      catch { append('Unable to load the archive. Please try again.'); }
    }
    history.scrollTop = history.scrollHeight; schedule();
  };
  form.hidden = false;
  form.addEventListener('submit', event => { event.preventDefault(); const value = input.value; input.value = ''; runCommand(value); });
  input.addEventListener('focus', () => { history.hidden = false; schedule(); });
  input.addEventListener('input', schedule);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') { collapse(); input.blur(); }
    // Only consume Tab when it actually completes; the next Tab leaves normally.
    if (event.key === 'Tab' && !event.shiftKey) {
      const matches = complete(input.value);
      if (matches.length === 1 && matches[0] !== input.value) { event.preventDefault(); input.value = matches[0]; }
      else if (matches.length > 1) { history.hidden = false; append(matches.join('  ')); }
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(timer); clearTimeout(fadeTimer); history.style.opacity = ''; remaining = Math.max(0, deadline - Date.now()); }
    else { deadline = Date.now() + remaining; timer = setTimeout(fade, remaining); }
  });
  return { runCommand, append, focus: () => input.focus(), collapse };
}
