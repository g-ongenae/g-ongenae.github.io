import "./index.css";
import "./App.css";

const commands = ["whoami", "cwd", "ps -aux", "ls -la"];
const processWords = ["Fastening.", "Vibing.", "Telling."];
const links = ["LinkedIn", "GitHub", "Blog"];
const faviconEmojis = ["🎷", "🎸", "🥁", "🧘‍♂️", "🕺", "🏃‍♂️", "✍️", "👨‍💻"];
const emojiDropCount = 34;
const rainFps = 20;

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
