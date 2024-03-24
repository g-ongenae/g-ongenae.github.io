import Menu from "./Menu";

// TODO

export default function LanguageView({ setView }) {
  return (
    <section>
      <h1>Languages</h1>

      <Menu currentView="lang" setView={setView} />
    </section>
  )
}