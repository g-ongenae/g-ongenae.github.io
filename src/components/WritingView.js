import Menu from "./Menu";

// TODO

export default function WritingView({ setView }) {
  return <section>
    <h1>Writing</h1>

    <Menu currentView="writing" setView={setView} />
  </section>
}