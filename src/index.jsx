import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const faviconEmojis = ["🎷", "🎸", "🥁", "🧘‍♂️", "🕺", "🏃‍♂️", "✍️", "👨‍💻"];

const setRandomFavicon = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  const emoji = faviconEmojis[Math.floor(Math.random() * faviconEmojis.length)];

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "48px Apple Color Emoji, Segoe UI Emoji, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(emoji, canvas.width / 2, canvas.height / 2 + 2);

  let favicon = document.querySelector("link[data-random-favicon]");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.dataset.randomFavicon = "true";
    document.head.appendChild(favicon);
  }
  favicon.href = canvas.toDataURL("image/png");
};

setRandomFavicon();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
