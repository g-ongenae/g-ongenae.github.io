import profile from "../profile.jpg";
import Menu from './Menu'

export default function HomeView({ setView }) {
  return (
    <section style={{ backgroundColor: "#282c34" }}>
      <img src={profile} className="profile" alt="profile" />

      <br />

      <a
        href="https://www.linkedin.com/in/guillaumeongenae/"
        className="title"
      >
        Guillaume Ongenae
      </a>

      <hr width="80vmin" />
      <span className="subtitle">Developer in Paris</span>

      <Menu currentView="home" setView={setView} />
  </section>
  );
}