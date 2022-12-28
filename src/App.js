import Konami from "konami";
import { useEffect } from "react";

import profile from "./profile.jpg";
import "./App.css";

function App() {
  useEffect(() => {
    // eslint-disable-next-line
    new Konami(() => alert("Joyeux Noël et Bonne année 2023 !"));
  }, []);

  return (
    <div className="app">
      <section>
        <img src={profile} className="profile" alt="profile" />

        <br />

        <a
          href="https://www.linkedin.com/in/guillaumeongenae/"
          className="title"
        >
          Guillaume Ongenae
        </a>

        <hr width="80vmin" />

        <span className="subtitle">Backend developer in Paris</span>
      </section>
    </div>
  );
}

export default App;
