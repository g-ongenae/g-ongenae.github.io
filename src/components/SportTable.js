const data = [
  {
    id: 0,
    sport: "Running 🏃",
    experience: "+10y",
    level: "Paris Marathon 2023 in 3 h 47 min, VMA 16km/h",
    goal: "Marathon in 3h",
    resource: { name: "Polar Flow", link: "https://flow.polar.com" },
  },
  {
    id: 1,
    sport: "Yoga 🧘",
    experience: "2y",
    level: "Hand on the ground in a lateral split (35 cm)",
    goal: "Side split",
    resource: { name: "Track Yoga", link: "https://trackyoga.app" },
  },
  {
    id: 2,
    sport: "Swing 🕺",
    experience: "1.5y",
    level: "Having fun",
    goal: "A lot more fun",
    resource: { name: "g-ongenae/awesome-swing", link: "https://github.com/g-ongenae/awesome-swing" },
  },
  {
    id: 3,
    sport: "Strength 💪",
    experience: ">1y",
    level: "Level 2 on Method Lafay",
    goal: "Complementary",
    resource: { name: "Lafay Method", link: "https://olivier-lafay.com" },
  },
];

/** List of sport I'm practicing and my goals on each */
export default function SportTable() {
  return (
    <table className="sport-table">
      <thead>
        <tr>
          <th>Sport</th>
          <th>Experience</th>
          <th>Current level</th>
          <th>Goal</th>
          <th>Resource</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.sport}</td>
            <td>{row.experience}</td>
            <td>{row.level}</td>
            <td>{row.goal}</td>
            <td><a href={row.resource.link}> {row.resource.name}</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
