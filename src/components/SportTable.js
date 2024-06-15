const data = [
  {
    id: 0,
    sport: "Running 🏃",
    experience: "2012-01-01T00:00:00.000Z",
    level: "Paris Marathon 2023 in 3 h 47 min, VMA 16km/h",
    goal: "Marathon in 3h",
    resource: { name: "Polar Flow", link: "https://flow.polar.com" },
  },
  {
    id: 1,
    sport: "Yoga 🧘",
    experience: "2022-05-09T00:00:00.000Z",
    level: "Hand on the ground in a lateral split (35 cm)",
    goal: "Side split",
    resource: { name: "Track Yoga", link: "https://trackyoga.app" },
  },
  {
    id: 2,
    sport: "Swing 🕺",
    experience: "2022-12-20T00:00:00.000Z",
    level: "Having fun",
    goal: "A lot more fun",
    resource: {
      name: "g-ongenae/awesome-swing",
      link: "https://github.com/g-ongenae/awesome-swing",
    },
  },
  {
    id: 3,
    sport: "Strength 💪",
    experience: "2024-04-01T00:00:00.000Z",
    level: "Level 2 on Method Lafay",
    goal: "Complementary",
    resource: { name: "Lafay Method", link: "https://olivier-lafay.com" },
  },
];

/**
 * Convert a date to a human readable format
 * @param {String} experience the date when I started the sport
 * @returns {string} the experience in a human readable format
 */
const convertExperienceDate = (experience) => {
  const experienceDate = new Date(experience);
  const currentDate = new Date();

  const yearDiff = Math.abs(
    currentDate.getFullYear() - experienceDate.getFullYear()
  );

  if (yearDiff >= 10) return ">10y";
  if (yearDiff >= 2) return `${yearDiff}y`;
  if (yearDiff === 1) return ">1y";

  return "<1y";
};

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
            <td>{convertExperienceDate(row.experience)}</td>
            <td>{row.level}</td>
            <td>{row.goal}</td>
            <td><a href={row.resource.link}> {row.resource.name}</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
