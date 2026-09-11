import "./App.css";

const emojis = ["🎷", "🎸", "🥁", "🧘‍♂️", "🕺", "🏃‍♂️", "✍️", "👨‍💻"];

const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/guillaumeongenae/", icon: "↗" },
  { label: "GitHub", href: "https://github.com/g-ongenae", icon: "↗" },
  { label: "Blog", href: "/blog", icon: "↗" },
];

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

function App() {
  return (
    <main className="landing-page">
      <EmojiRain />
      <div className="scanlines" aria-hidden="true" />
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">{"// personal frequency detected"}</p>
        <h1 id="hero-title">Guillaume<span>Ongenae</span></h1>
        <p className="intro">Developer, musician, mover.</p>
        <nav className="links" aria-label="Personal links">
          {links.map((link) => (
            <a className="link-card" href={link.href} key={link.label}
              {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
              <span>{link.label}</span><span className="link-icon">{link.icon}</span>
            </a>
          ))}
        </nav>
      </section>
      <footer className="status-bar"><span className="status-dot" /><span>online</span><span className="status-divider">|</span><span>Paris, FR</span></footer>
    </main>
  );
}

export default App;
