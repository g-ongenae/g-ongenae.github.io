import "./index.css";
import "./App.css";

// Useful content first (name, links), ambience afterwards.
const commands = ["whoami", "ls -la", "ps -aux", "pwd & ssh"];
const introPlayedKey = "intro-played";
// Milliseconds. Kept fast enough that the whole sequence lands in ~4s.
const timing = {
  initialDelay: 200,
  typing: 45,
  afterTyping: 180,
  beforeOutput: 150,
  betweenLines: 140,
  betweenCommands: 350,
  historyLifetime: 30000,
  historyLifetimeMobile: 7000,
  historyFade: 1500,
};
// Two-column output ("name - description"); the name column is as wide as
// the longest name so the dashes line up, even when a description wraps.
const alignColumns = (rows) => {
  const width = Math.max(...rows.map(([name]) => name.length));
  return rows.map(([name, text]) => ({ name, text, width }));
};
const processes = [
  ["grounding", "Laying foundations at my work (Algoan)."],
  [
    "vibing",
    "Creating apps, dancing, travelling, writing, playing music and learning languages.",
  ],
  ["telling", "Taking notes on my blog and on LinkedIn."],
];
const processWords = processes.map(
  ([name]) => `${name[0].toUpperCase()}${name.slice(1)}.`,
);
const processDetails = alignColumns(processes);
const helpLines = alignColumns([
  ["whoami", "who is behind this page"],
  ["ls -la", "list links"],
  ["ps -aux", "what I am doing"],
  ["ps -laux", "what I am doing, in detail"],
  ["pwd", "where am I"],
  ["ssh", "am I online?"],
  ["ping", "contact info"],
  ["cd <link>", "open a link (cd github)"],
  ["clear", "clear the history"],
  ["help", "show this list"],
]);
// Kept encoded so address scrapers don't pick it up from the bundle.
const contactAddress = () =>
  window.atob("Z3VpbGxhdW1lLm9uZ2VuYWVAZ21haWwuY29t");
const links = ["LinkedIn", "GitHub", "Blog"];
const faviconEmojis = ["🎷", "🎸", "🥁", "🧘‍♂️", "🕺", "🏃‍♂️", "✍️", "👨‍💻"];
const emojiDropCount = 34;
const rainFps = 20;

const terminalHistory = document.querySelector(".terminal-history");
const terminalForm = document.querySelector(".terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const blogLink = document.querySelector('[data-coming-soon="true"]');
const linkCards = [...document.querySelectorAll(".link-card")];

// "cd github", "cd GitHub/", "cd ./blog" all resolve to the matching card.
const findLink = (target) => {
  const name = target.replace(/^\.\//, "").replace(/\/$/, "").toLowerCase();
  return linkCards.find(
    (card) =>
      card.querySelector("span")?.textContent.trim().toLowerCase() === name,
  );
};
const cdTarget = (command) => command.slice(2).trim();
const isCd = (command) => /^cd(\s|$)/.test(command);
// A cd that actually opens a page (not the blog, not "cd" alone).
const cdDestination = (command) => {
  if (!isCd(command)) return undefined;
  const link = findLink(cdTarget(command));
  return link && !link.dataset.comingSoon ? link : undefined;
};
const contentByCommand = {
  whoami: document.querySelector("#hero-title"),
  "ps -aux": document.querySelector(".intro"),
  "ls -la": document.querySelector(".links"),
  pwd: document.querySelector(".status-location"),
  ssh: document.querySelector(".status-online"),
};
contentByCommand["ps -laux"] = contentByCommand["ps -aux"];

const collapseCommand = (command) =>
  command
    .trim()
    .replace(/^\$\s*/, "")
    .replace(/\s+/g, " ");

// "pwd & ssh", "pwd && ssh" and "pwd; ssh" all run both, in order.
const splitCommands = (command) =>
  collapseCommand(command)
    .split(/\s*(?:&&|&|;)\s*/)
    .map(normalizeCommand)
    .filter(Boolean);

// Accept the common spellings of each command (e.g. "ps aux" for "ps -aux").
const normalizeCommand = (command) => {
  const normalized = collapseCommand(command);
  if (/^ps( -?(aux|xau|uax))?$/.test(normalized)) return "ps -aux";
  if (/^ps -?(laux|alux|aulx)$/.test(normalized)) return "ps -laux";
  if (/^ls( -(la|al|a|l))?$/.test(normalized)) return "ls -la";
  return normalized;
};

const commandOutput = (command) => {
  if (command === "whoami") return ["Guillaume Ongenae"];
  if (command === "pwd") return ["Paris, FR"];
  if (/^ssh(\s|$)/.test(command)) return ["online"];
  if (command === "ps -aux") return processWords;
  if (command === "ps -laux") return processDetails;
  if (command === "ls -la") return links;
  if (command === "help") return helpLines;
  if (command === "ping") {
    const address = contactAddress();
    return [
      { text: `PING ${address}`, href: `mailto:${address}` },
      "64 bytes from Paris: opening your mail client...",
    ];
  }
  if (isCd(command)) {
    const target = cdTarget(command);
    if (!target || target === "~" || target === "/") return [];
    const link = findLink(target);
    if (!link) return [`cd: no such file or directory: ${target}`];
    if (link.dataset.comingSoon) return ["fatal: coming soon"];
    const url = new URL(link.href);
    return [
      {
        text: `${url.host}${url.pathname.replace(/\/$/, "")}`,
        href: link.href,
      },
    ];
  }
  return [`${command}: command not found (try "help")`];
};

function setRandomFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  const emoji = faviconEmojis[Math.floor(Math.random() * faviconEmojis.length)];

  context.font = "48px Apple Color Emoji, Segoe UI Emoji, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(emoji, canvas.width / 2, canvas.height / 2 + 2);

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = canvas.toDataURL("image/png");
  document.head.append(favicon);
}

function setupEmojiRain() {
  const rain = document.querySelector(".emoji-rain");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const frameInterval = 1000 / rainFps;
  const drops = Array.from({ length: emojiDropCount }, (_, index) => {
    const element = document.createElement("span");
    element.className = "emoji-drop";
    element.textContent = faviconEmojis[index % faviconEmojis.length];
    element.style.left = `${((index + 0.5) / emojiDropCount) * 100}%`;
    element.style.fontSize = `${1.05 + ((index * 0.17) % 0.75)}rem`;
    rain.append(element);

    return {
      element,
      delay: ((index * 0.37) % 8) * 1000,
      duration: (7 + ((index * 1.13) % 7)) * 1000,
    };
  });

  let animationFrame;
  let previousFrame = 0;
  let runningSince = 0;
  let elapsedBeforePause = 0;
  let endY = window.innerHeight * 1.25;
  const startY = -160;

  const updateDrops = (elapsed) => {
    for (const drop of drops) {
      const dropElapsed = elapsed - drop.delay;
      if (dropElapsed < 0) {
        drop.element.style.opacity = "0";
        continue;
      }

      const progress = (dropElapsed % drop.duration) / drop.duration;
      const opacity =
        progress < 0.08
          ? (progress / 0.08) * 0.8
          : progress < 0.75
            ? 0.8 - ((progress - 0.08) / 0.67) * 0.25
            : 0.55 * (1 - (progress - 0.75) / 0.25);
      const y = startY + (endY - startY) * progress;

      drop.element.style.transform = `translate3d(0, ${y}px, 0)`;
      drop.element.style.opacity = opacity.toFixed(3);
    }
  };

  const animate = (time) => {
    const sincePreviousFrame = time - previousFrame;
    if (sincePreviousFrame >= frameInterval) {
      previousFrame = time - (sincePreviousFrame % frameInterval);
      updateDrops(elapsedBeforePause + time - runningSince);
    }
    animationFrame = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (animationFrame !== undefined) return;
    previousFrame = 0;
    runningSince = performance.now();
    animationFrame = window.requestAnimationFrame(animate);
  };

  const stop = () => {
    if (animationFrame === undefined) return;
    elapsedBeforePause += performance.now() - runningSince;
    window.cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
  };

  const syncAnimation = () => {
    if (document.hidden || reducedMotion.matches) stop();
    else start();
  };

  window.addEventListener("resize", () => {
    endY = window.innerHeight * 1.25;
  });
  document.addEventListener("visibilitychange", syncAnimation);
  reducedMotion.addEventListener("change", syncAnimation);
  syncAnimation();
}

function revealCommand(command, { instant = false } = {}) {
  const element = contentByCommand[command];
  if (!element || !element.classList.contains("command-hidden")) return;
  element.classList.remove("command-hidden");
  if (!instant) element.classList.add("command-revealed");
}

function readIntroPlayed() {
  try {
    return window.sessionStorage.getItem(introPlayedKey) === "1";
  } catch {
    return false;
  }
}

function writeIntroPlayed() {
  try {
    window.sessionStorage.setItem(introPlayedKey, "1");
  } catch {
    // Storage unavailable (privacy mode); the intro simply replays.
  }
}

function setupTerminal() {
  const isMobile = window.matchMedia("(max-width: 560px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const skipIntro = reducedMotion.matches || readIntroPlayed();

  let nextId = 0;
  let fadeTimer;
  let clearTimer;

  // The input is only as wide as its text (monospace, so 1ch per character),
  // which keeps the block cursor glued to the end of what was typed.
  const syncInputWidth = () => {
    terminalInput.style.width = `${Math.max(1, terminalInput.value.length)}ch`;
  };
  const setInputValue = (value) => {
    terminalInput.value = value;
    syncInputWidth();
  };
  terminalInput.addEventListener("input", syncInputWidth);
  syncInputWidth();
  // Output lines still waiting to print; flushed in order on fast-forward.
  const pendingLines = new Map();
  // Sequencing steps (pauses, next-command scheduling); dropped on fast-forward.
  const pendingSteps = new Set();

  const scheduleLine = (fn, ms) => {
    const id = window.setTimeout(() => {
      pendingLines.delete(id);
      fn();
    }, ms);
    pendingLines.set(id, fn);
  };

  const scheduleStep = (fn, ms) => {
    const id = window.setTimeout(() => {
      pendingSteps.delete(id);
      fn();
    }, ms);
    pendingSteps.add(id);
  };

  const flushPendingLines = () => {
    const lines = [...pendingLines];
    pendingLines.clear();
    for (const [id, fn] of lines) {
      window.clearTimeout(id);
      fn();
    }
  };

  const cancelPendingSteps = () => {
    for (const id of pendingSteps) window.clearTimeout(id);
    pendingSteps.clear();
  };

  const cancelHistoryFade = () => {
    window.clearTimeout(fadeTimer);
    window.clearTimeout(clearTimer);
    terminalHistory.classList.remove("history-fading");
  };

  const scheduleHistoryFade = () => {
    cancelHistoryFade();
    fadeTimer = window.setTimeout(
      () => {
        terminalHistory.classList.add("history-fading");
        clearTimer = window.setTimeout(() => {
          terminalHistory.replaceChildren();
          terminalHistory.classList.remove("history-fading");
        }, timing.historyFade);
      },
      isMobile.matches ? timing.historyLifetimeMobile : timing.historyLifetime,
    );
  };

  // A line is plain text, { text, href } for a clickable link, or
  // { name, text, width } for an aligned two-column row.
  const appendLine = (outputElement, line) => {
    const lineElement = document.createElement("div");
    lineElement.className = "terminal-line";
    if (typeof line === "string") {
      lineElement.textContent = line;
    } else if (line.href) {
      const anchor = document.createElement("a");
      anchor.href = line.href;
      if (/^https?:/.test(line.href)) {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }
      anchor.textContent = line.text;
      lineElement.append(anchor);
    } else {
      lineElement.classList.add("terminal-columns");
      const nameElement = document.createElement("span");
      nameElement.style.width = `${line.width}ch`;
      nameElement.textContent = line.name;
      const textElement = document.createElement("span");
      textElement.textContent = `- ${line.text}`;
      lineElement.append(nameElement, textElement);
    }
    outputElement.append(lineElement);
  };

  const runCommand = (rawCommand, { instant = false } = {}) => {
    const parts = splitCommands(rawCommand);
    // Single commands show their canonical spelling; chains show as typed.
    const command = parts.length === 1 ? parts[0] : collapseCommand(rawCommand);

    if (parts.length === 0) {
      // Enter on an empty line echoes a bare prompt, like a real shell.
      const entry = document.createElement("div");
      entry.className = "terminal-entry";
      entry.dataset.id = nextId++;
      entry.innerHTML =
        '<div class="terminal-command"><span class="prompt">$</span></div>';
      terminalHistory.append(entry);
      scheduleHistoryFade();
      return;
    }

    if (command === "clear") {
      flushPendingLines();
      cancelHistoryFade();
      terminalHistory.replaceChildren();
      setInputValue("");
      return;
    }

    const output = parts.flatMap(commandOutput);
    for (const part of parts) {
      // Reveal on submit, not after the output finishes printing.
      revealCommand(part, { instant });
      if (part === "ping") window.location.assign(`mailto:${contactAddress()}`);
      const destination = cdDestination(part);
      if (destination) window.open(destination.href, "_blank", "noreferrer");
    }
    cancelHistoryFade();
    setInputValue("");

    const entry = document.createElement("div");
    entry.className = "terminal-entry";
    entry.dataset.id = nextId++;
    const commandElement = document.createElement("div");
    commandElement.className = "terminal-command";
    commandElement.innerHTML = '<span class="prompt">$</span> ';
    commandElement.append(document.createTextNode(command));
    const outputElement = document.createElement("div");
    outputElement.className = "terminal-output";
    entry.append(commandElement, outputElement);
    terminalHistory.append(entry);

    if (instant || output.length === 0) {
      output.forEach((line) => appendLine(outputElement, line));
      scheduleHistoryFade();
      return;
    }

    output.forEach((line, index) => {
      scheduleLine(
        () => {
          appendLine(outputElement, line);
          if (index === output.length - 1) scheduleHistoryFade();
        },
        timing.beforeOutput + index * timing.betweenLines,
      );
    });
  };

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(terminalInput.value);
  });

  // --- Focus: the input is the only field, so it should always be ready ---

  const focusInput = () => {
    if (document.activeElement === terminalInput) return;
    terminalInput.focus({ preventScroll: true });
  };
  const isInteractive = (target) =>
    target instanceof Element && target.closest("a, button, input");

  focusInput();
  window.addEventListener("focus", focusInput);
  // Tapping anywhere that isn't a link brings the keyboard/caret back.
  document.addEventListener("click", (event) => {
    if (!isInteractive(event.target)) focusInput();
  });
  // Typing anywhere lands in the input; keys that navigate (Tab, Enter on a
  // focused link, shortcuts with modifiers) are left alone.
  document.addEventListener("keydown", (event) => {
    if (event.target === terminalInput) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length !== 1 && event.key !== "Backspace") return;
    focusInput();
  });

  // --- Scripted intro -------------------------------------------------------

  const queue = [...commands];
  let currentlyTyping;
  let typingTimer;
  let introDone = false;

  const finishIntro = () => {
    if (introDone) return;
    introDone = true;
    writeIntroPlayed();
    document.removeEventListener("keydown", fastForward);
    document.removeEventListener("pointerdown", fastForward);
  };

  // Any key or click skips straight to the finished state.
  const fastForward = () => {
    if (introDone) return;
    window.clearInterval(typingTimer);
    cancelPendingSteps();
    flushPendingLines();
    const remaining = currentlyTyping
      ? [currentlyTyping, ...queue]
      : [...queue];
    currentlyTyping = undefined;
    queue.length = 0;
    for (const command of remaining) runCommand(command, { instant: true });
    finishIntro();
  };

  const playNextCommand = () => {
    const command = queue.shift();
    if (!command) {
      finishIntro();
      return;
    }

    currentlyTyping = command;
    let character = 0;
    setInputValue("");
    typingTimer = window.setInterval(() => {
      character += 1;
      setInputValue(command.slice(0, character));
      if (character < command.length) return;

      window.clearInterval(typingTimer);
      typingTimer = undefined;
      scheduleStep(() => {
        currentlyTyping = undefined;
        runCommand(command);
        // Overlap: start typing the next command as soon as this output
        // begins printing, instead of waiting for it to finish.
        scheduleStep(
          playNextCommand,
          timing.beforeOutput + timing.betweenCommands,
        );
      }, timing.afterTyping);
    }, timing.typing);
  };

  if (skipIntro) {
    // Reduced motion or a repeat visit: everything on screen immediately,
    // with the history already printed.
    for (const command of queue) runCommand(command, { instant: true });
    queue.length = 0;
    finishIntro();
    return { runCommand };
  }

  document.addEventListener("keydown", fastForward);
  document.addEventListener("pointerdown", fastForward);
  scheduleStep(playNextCommand, timing.initialDelay);
  return { runCommand };
}

// The blog card is marked "coming soon" in the markup; clicking it answers
// through the terminal instead of navigating.
function setupBlogLink(runCommand) {
  blogLink?.addEventListener("click", (event) => {
    event.preventDefault();
    runCommand("cd blog");
  });
}

setRandomFavicon();
setupEmojiRain();
setupBlogLink(setupTerminal().runCommand);
