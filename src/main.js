import { createTerminal } from "./terminal.js";
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

const linkCards = [...document.querySelectorAll(".link-card")];

const externalCdLinks = {
  instagram: "https://www.instagram.com/gongenae/",
  ig: "https://www.instagram.com/gongenae/",
  strava: "https://www.strava.com/athletes/136716050",
  facebook: "https://www.facebook.com/gongenae",
  fb: "https://www.facebook.com/gongenae",
  chess: "https://www.chess.com/member/gongenae",
  youtube: "https://www.youtube.com/@GuillaumeOngenae",
  yt: "https://www.youtube.com/@GuillaumeOngenae",
  twitch: "https://www.twitch.tv/gongenae",
};

const normalizeCdTarget = (target) =>
  target.replace(/^\.\//, "").replace(/\/$/, "").toLowerCase();
const externalCdDestination = (target) =>
  externalCdLinks[normalizeCdTarget(target)];

// "cd github", "cd GitHub/", "cd ./blog" all resolve to the matching card.
const findLink = (target) => {
  const name = normalizeCdTarget(target);
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
  const externalDestination = externalCdDestination(cdTarget(command));
  if (externalDestination) return { href: externalDestination };
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

const commandOutput = (command) => {
  if (/^ps( -?(aux|xau|uax))?$/.test(command)) command = "ps -aux";
  if (/^ps -?(laux|alux|aulx)$/.test(command)) command = "ps -laux";
  if (/^ls( -(la|al|a|l))?$/.test(command)) command = "ls -la";
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
    const externalDestination = externalCdDestination(target);
    if (externalDestination) {
      const url = new URL(externalDestination);
      return [
        {
          text: `${url.host}${url.pathname.replace(/\/$/, "")}`,
          href: externalDestination,
        },
      ];
    }
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
  const mount = document.querySelector('.terminal');
  const terminal = createTerminal({ mount, timing, commands: command => {
    revealCommand(command, { instant: true });
    if (command === 'ping') window.location.assign(`mailto:${contactAddress()}`);
    if (/^cd\s+(?:\.\/)?blog(?:\/|$)/i.test(command)) {
      const target = cdTarget(command).replace(/^\.\//, '');
      window.location.assign(new URL(`/${target}`, window.location.origin));
      return [];
    }
    const destination = cdDestination(command);
    if (destination) window.location.assign(destination.href);
    return commandOutput(command);
  }});
  // Intro sequencing belongs to the landing page, never to the shared shell.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer, typingTimer, typingCommand;
  const input = mount.querySelector('input');
  const queue = [...commands];
  const finish = () => {
    clearTimeout(timer);
    clearInterval(typingTimer);
    input.value = '';
    if (typingCommand) { terminal.runCommand(typingCommand); typingCommand = undefined; }
    for (const command of queue.splice(0)) terminal.runCommand(command);
    writeIntroPlayed();
    document.removeEventListener('pointerdown', finish);
    document.removeEventListener('keydown', finish);
  };
  const next = () => {
    if (document.hidden) return;
    const command = queue.shift();
    if (!command) { finish(); return; }
    typingCommand = command;
    let character = 0;
    typingTimer = setInterval(() => {
      if (document.hidden) return;
      input.value = command.slice(0, ++character);
      if (character < command.length) return;
      clearInterval(typingTimer);
      input.value = '';
      typingCommand = undefined;
      terminal.runCommand(command);
      timer = setTimeout(next, timing.beforeOutput + timing.betweenCommands);
    }, timing.typing);
  };
  if (reduced.matches || readIntroPlayed()) finish();
  else {
    document.addEventListener('pointerdown', finish);
    document.addEventListener('keydown', finish);
    timer = setTimeout(next, timing.initialDelay);
    document.addEventListener('visibilitychange', () => {
      clearTimeout(timer);
      if (!document.hidden && queue.length && !typingCommand) next();
    });
  }
  return terminal;
}

setRandomFavicon();
setupEmojiRain();
setupTerminal();
