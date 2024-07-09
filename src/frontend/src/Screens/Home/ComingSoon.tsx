import { Pricing } from "./Pricing"
import { YouTube } from "../../Components/Video"

export const ComingSoon = () => {
  return (
    <div className="container mx-auto text-center">
      <h1>Coming Soon</h1>

      <h2>Optimize your trading with data that supports your decisions</h2>
      <p>
        This project is being built in public so there isn't much here yet,
        but we are working on this every day.
      </p>

      <div>
        <h2>Podcast Episode 1 - Explains the goals of this dApp.</h2>
        <YouTube src="https://www.youtube.com/embed/yHnque24WHc?si=G6ShcswkkJfHSfQY" />
        <h2>Podcast Episode 2 - Explains how this dApp informs a trader's decisions.</h2>
        <YouTube src="https://www.youtube.com/embed/8B3UjcPlndg?si=ts6eI_cFsOdMJkfI" />
      </div>

      <div className="mb-8 text-center">
        <p>
          To stay in touch we have some options, bookmark this site, follow us on Twitter/X, and Subscribe on YouTube.
        </p>
        <a href="https://twitter.com/almormd" target="_blank" rel="noreferrer"
          className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-2">
          Follow Alex on X.com
        </a><br /><br />
        <a href="https://twitter.com/jfgrissom" target="_blank" rel="noreferrer"
          className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-2">
          Follow Jay on X.com
        </a><br /><br />
        <a href="https://www.youtube.com/@AlexAndJayPodcast" target="_blank" rel="noreferrer"
          className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-2">
          Subscribe to Alex and Jay's Podcast on YouTube
        </a><br /><br />
        <a href="https://oc.app/community/vmoft-nqaaa-aaaar-bh3pa-cai/?ref=ex43p-lqaaa-aaaar-bal2q-cai"
          target="_blank"
          rel="noreferrer"
          className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-2">
          Share ideas or propose changes on OpenChat
        </a>
      </div>
      <Pricing />
    </div >
  )
}