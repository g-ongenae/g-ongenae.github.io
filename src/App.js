import { useState } from "react";

import "./App.css";
import HomeView from "./components/HomeView";
// import LanguageView from "./components/LanguageView";
// import MusicView from "./components/MusicView";
import SportView from "./components/SportView";
// import WritingView from './components/WritingView';

const viewMap = {
  home: HomeView,
  // lang: LanguageView,
  // music: MusicView,
  sport: SportView,
  // writing: WritingView,
};

function App() {
  const [value, setValue] = useState("home");

  return <div className="app">{viewMap[value]({ setView: setValue })}</div>;
}

export default App;
