import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const emojis = ["🎷", "🎸", "🥁", "🧘‍♂️", "🕺", "🏃‍♂️", "✍️", "👨‍💻"];

const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/guillaumeongenae/", icon: "↗" },
  { label: "GitHub", href: "https://github.com/g-ongenae", icon: "↗" },
  { label: "Blog", href: "/blog", icon: "↗" },
];

const commands = ["whoami", "cwd", "ps -aux", "ls -la"];
const processWords = ["Fastening.", "Vibing.", "Telling."];

const commandOutput = (command) => {
  if (command === "whoami") return ["Guillaume Ongenae"];
  if (command === "cwd") return ["/Online Paris"];
  if (command === "ps -aux") return processWords;
  if (command === "ls -la") return links.map(({ label }) => label);
  return ["command not found"];
};

function EmojiRain() {
  return (
    <div className="emoji-rain" aria-hidden="true">
      {Array.from({ length: 34 }, (_, index) => (
        <span className="emoji-drop" key={index} style={{
          "--column": index,
          "--delay": `${(index * 0.37) % 8}s`,
          "--duration": `${7 + ((index * 1.13) % 7)}s`,
          "--size": `${1.05 + ((index * 0.17) % 0.75)}rem`,
        }}>{emojis[index % emojis.length]}</span>
      ))}
    </div>
  );
}

function Terminal({ onCommand }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const idRef = useRef(0);
  const inputRef = useRef(null);
  const commandIndexRef = useRef(0);
  const runningRef = useRef(false);
  const fadeTimerRef = useRef(null);
  const clearTimerRef = useRef(null);
  const onCommandRef = useRef(onCommand);
  const [historyFading, setHistoryFading] = useState(false);
  onCommandRef.current = onCommand;

  const runCommand = useCallback((rawCommand) => {
    const command = rawCommand.trim().replace(/^\$\s*/, "");
    if (!command || runningRef.current) return;

    runningRef.current = true;
    const id = idRef.current++;
    const output = commandOutput(command);
    onCommandRef.current(command);
    window.clearTimeout(fadeTimerRef.current);
    window.clearTimeout(clearTimerRef.current);
    setHistoryFading(false);
    setHistory((current) => [...current, { id, command, output: [] }]);
    setInput("");

    window.setTimeout(() => {
      output.forEach((line, index) => {
        window.setTimeout(() => {
          setHistory((current) => current.map((entry) =>
            entry.id === id ? { ...entry, output: [...entry.output, line] } : entry
          ));
          if (index === output.length - 1) {
            runningRef.current = false;
            fadeTimerRef.current = window.setTimeout(() => {
              setHistoryFading(true);
              clearTimerRef.current = window.setTimeout(() => setHistory([]), 1500);
            }, 30000);
          }
        }, index * (command === "ps -aux" ? 380 : 260));
      });
    }, command === "ps -aux" ? 360 : 240);
  }, []);

  useEffect(() => {
    let typingTimer;
    let submitTimer;
    let nextTimer;
    let cancelled = false;

    const playNextCommand = () => {
      if (cancelled) return;
      const commandIndex = commandIndexRef.current;
      const command = commands[commandIndex];
      commandIndexRef.current += 1;
      let character = 0;
      setInput("");
      typingTimer = window.setInterval(() => {
        if (cancelled) return;
        character += 1;
        setInput(command.slice(0, character));
        if (character === command.length) {
          window.clearInterval(typingTimer);
          submitTimer = window.setTimeout(() => {
            if (!cancelled) {
              runCommand(command);
              if (commandIndex < commands.length - 1) {
                nextTimer = window.setTimeout(playNextCommand, 2600);
              }
            }
          }, 520);
        }
      }, 105);
    };

    nextTimer = window.setTimeout(playNextCommand, 900);
    return () => {
      cancelled = true;
      window.clearInterval(typingTimer);
      window.clearTimeout(submitTimer);
      window.clearTimeout(nextTimer);
      window.clearTimeout(fadeTimerRef.current);
      window.clearTimeout(clearTimerRef.current);
    };
  }, [runCommand]);

  const handleSubmit = (event) => {
    event.preventDefault();
    runCommand(input);
  };

  return (
    <section className="terminal" aria-label="Command history">
      <div className={`terminal-history ${historyFading ? "history-fading" : ""}`} aria-live="polite">
        {history.map((entry) => (
          <div className="terminal-entry" key={entry.id}>
            <div className="terminal-command"><span className="prompt">$</span> {entry.command}</div>
            <div className="terminal-output">
              {entry.output.map((line, index) => (
                <div className="terminal-line" key={`${entry.id}-${index}`}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="terminal-input">Enter a command</label>
        <span className="prompt" aria-hidden="true">$</span>
        <input
          ref={inputRef}
          id="terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          spellCheck="false"
          aria-label="Terminal command input"
        />
        <span className="cursor" aria-hidden="true" />
      </form>
    </section>
  );
}

function App() {
  const [revealedCommands, setRevealedCommands] = useState([]);

  const revealCommand = (command) => {
    setRevealedCommands((current) => current.includes(command) ? current : [...current, command]);
  };

  return (
    <main className="landing-page">
      <EmojiRain />
      <div className="scanlines" aria-hidden="true" />
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className={revealedCommands.includes("whoami") ? "command-revealed" : "command-hidden"}>Guillaume<span>Ongenae</span></h1>
        <p className={`intro ${revealedCommands.includes("ps -aux") ? "command-revealed" : "command-hidden"}`}>Fastening. Vibing. Telling.</p>
        <nav className={`links ${revealedCommands.includes("ls -la") ? "command-revealed" : "command-hidden"}`} aria-label="Personal links">
          {links.map((link) => (
            <a className="link-card" href={link.href} key={link.label}
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
              <span>{link.label}</span><span className="link-icon">{link.icon}</span>
            </a>
          ))}
        </nav>
      </section>
      <footer className={`status-bar ${revealedCommands.includes("cwd") ? "command-revealed" : "command-hidden"}`}><span className="status-dot" /><span>online</span><span className="status-divider">|</span><span>Paris, FR</span></footer>
      <Terminal onCommand={revealCommand} />
    </main>
  );
}

export default App;
