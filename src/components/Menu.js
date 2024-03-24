import HomeView from "./HomeView";
// import LanguageView from "./LanguageView";
// import MusicView from "./MusicView";
import SportView from "./SportView";
// import WritingView from "./WritingView";

const pages = {
  home: { title: "Home", target: HomeView },
  code: { title: "Code", link: "https://github.com/g-ongenae" },
  // music: { title: "Music", target: MusicView },
  // lang: { title: "Languages", target: LanguageView },
  sport: { title: "Sports", target: SportView },
  // writing: { title: "Writing", target: WritingView },
};

export default function Menu({ currentView, setView }) {
  const pageNamesToDisplay = Object.keys(pages);

  return (
    <ul className="menu">
      {pageNamesToDisplay.map((pageName) => {
        return pages[pageName].link !== undefined ? (
          <li key={pageName}>
            <a href={pages[pageName].link}>{pages[pageName].title}</a>
          </li>
        ) : (
          <li key={pageName} className={pageName === currentView ? 'selected' : ''}>
            <a onClick={() => setView(pageName)}>{pages[pageName].title}</a>
          </li>
        );
      })}
    </ul>
  );
}
