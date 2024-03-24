import Menu from "./Menu";

// TODO
// Music: 🎷 (alto), recorder (soprano), 🥁, 🎹 and 🎸 (acoustic) with [Drum Coach], [Tonestro] and [Yousician].

// [drum coach]: https://play.google.com/store/apps/details?id=com.drumap.drumcoach&pcampaignid=web_share
// [tonestro]: https://www.tonestro.com
// [yousician]: https://yousician.com

export default function MusicView({ setView }) {
  return <section>
    <h1>Music</h1>

    <Menu currentView="music" setView={setView} />
  </section>
}