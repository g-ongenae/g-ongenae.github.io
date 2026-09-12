import "./index.css";
import "./App.css";

const commands = ["whoami", "cwd", "ps -aux", "ls -la"];
const processWords = ["Fastening.", "Vibing.", "Telling."];
const links = ["LinkedIn", "GitHub", "Blog"];
const faviconEmojis = ["🎷", "🎸", "🥁", "🧘‍♂️", "🕺", "🏃‍♂️", "✍️", "👨‍💻"];

const terminalHistory = document.querySelector(".terminal-history");
const terminalForm = document.querySelector(".terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const contentByCommand = {
  whoami: document.querySelector("#hero-title"),
  "ps -aux": document.querySelector(".intro"),
  "ls -la": document.querySelector(".links"),
  cwd: document.querySelector(".status-bar"),
};

const commandOutput = (command) => {
  if (command === "whoami") return ["Guillaume Ongenae"];
  if (command === "cwd") return ["/Online Paris"];
  if (command === "ps -aux") return processWords;
  if (command === "ls -la") return links;
  return ["command not found"];
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
  const video = document.querySelector(".emoji-rain-video");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncPlayback = () => {
    if (document.hidden || reducedMotion.matches) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  document.addEventListener("visibilitychange", syncPlayback);
  reducedMotion.addEventListener("change", syncPlayback);
  syncPlayback();
}

function revealCommand(command) {
  const element = contentByCommand[command];
  if (!element || element.classList.contains("command-revealed")) return;
  element.classList.remove("command-hidden");
  element.classList.add("command-revealed");
}

function setupTerminal() {
  let nextId = 0;
  let commandIndex = 0;
  let running = false;
  let fadeTimer;
  let clearTimer;

  const runCommand = (rawCommand) => {
    const command = rawCommand.trim().replace(/^\$\s*/, "");
    if (!command || running) return;

    running = true;
    const id = nextId++;
    const output = commandOutput(command);
    revealCommand(command);
    window.clearTimeout(fadeTimer);
    window.clearTimeout(clearTimer);
    terminalHistory.classList.remove("history-fading");
    terminalInput.value = "";

    const entry = document.createElement("div");
    entry.className = "terminal-entry";
    entry.dataset.id = id;
    const commandElement = document.createElement("div");
    commandElement.className = "terminal-command";
    commandElement.innerHTML = '<span class="prompt">$</span> ';
    commandElement.append(document.createTextNode(command));
    const outputElement = document.createElement("div");
    outputElement.className = "terminal-output";
    entry.append(commandElement, outputElement);
    terminalHistory.append(entry);

    window.setTimeout(() => {
      output.forEach((line, index) => {
        window.setTimeout(() => {
          const lineElement = document.createElement("div");
          lineElement.className = "terminal-line";
          lineElement.textContent = line;
          outputElement.append(lineElement);

          if (index === output.length - 1) {
            running = false;
            fadeTimer = window.setTimeout(() => {
              terminalHistory.classList.add("history-fading");
              clearTimer = window.setTimeout(() => {
                terminalHistory.replaceChildren();
                terminalHistory.classList.remove("history-fading");
              }, 1500);
            }, window.matchMedia("(max-width: 560px)").matches ? 7000 : 30000);
          }
        }, index * (command === "ps -aux" ? 380 : 260));
      });
    }, command === "ps -aux" ? 360 : 240);
  };

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(terminalInput.value);
  });

  const playNextCommand = () => {
    if (commandIndex >= commands.length) return;
    const command = commands[commandIndex++];
    let character = 0;
    terminalInput.value = "";
    const typingTimer = window.setInterval(() => {
      character += 1;
      terminalInput.value = command.slice(0, character);
      if (character === command.length) {
        window.clearInterval(typingTimer);
        window.setTimeout(() => {
          runCommand(command);
          if (commandIndex < commands.length) window.setTimeout(playNextCommand, 2600);
        }, 520);
      }
    }, 105);
  };

  window.setTimeout(playNextCommand, 900);
}

setRandomFavicon();
setupEmojiRain();
setupTerminal();
