import profile from './profile.jpg';
import './App.css';

function App() {
  return (
    <div className="app">
      <section>
        <img src={profile} className="profile" alt="profile" />

        <br />

        <a href="https://www.linkedin.com/in/guillaumeongenae/" className="title" >
          Guillaume Ongenae
        </a>

        <hr width="80vmin" />

        <span className="subtitle">Backend developer in Paris</span>
      </section>
    </div>
  );
}

export default App;
