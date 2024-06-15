import Menu from "./Menu";
import SportTable from "./SportTable";

export default function SportView({ setView }) {
  return (
    <section>
      <h1>Sports</h1>

      <h3>My main sports</h3>
      <SportTable />

      <h3>Other sports</h3>
      <p>
        Otherwise, I like to 🏂 (regular), ⛷️, 🚴 (hiking) and{" "}
        <span title="Efren style">🎱</span>.
      </p>
      <p>My next interests are 🏌️ Golf and 🎾 Tennis.</p>
      <p>
        In the past, I used to practice 🏀 Basketball (10y, small forward), 🏈
        US Football (4y, defensive back).
      </p>

      <h3>Social Networks</h3>

      <p>
        You can follow my progress on:{" "}
        <a href="https://www.strava.com/athletes/136716050">Strava</a> or{" "}
        <a href="https://www.instagram.com/gongenae/">Instagram</a>
      </p>

      <Menu currentView="sport" setView={setView} />
    </section>
  );
}
