import { Pricing } from "./Pricing"
import { YouTube } from "../../Components/Video"

export const ComingSoon = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-center">Coming Soon</h1>

      <h2 className="text-left">Optimize your trading with data that supports your decisions</h2>
      <p className="text-left" style={{ marginBottom: '40px' }}>
        This project is being built in public so there isn't much here yet,
        but we are working on this every day.
      </p>

      <div className=" xl:columns-2 lg:columns-1 md:columns-1 sm:columns-1 xs:columns-1">
        <div className="width-full">
          <h2>Podcast Episode 1 - Explains the goals of this dApp and why it's being built.</h2>
          <YouTube src="https://www.youtube.com/embed/yHnque24WHc?si=G6ShcswkkJfHSfQY" />
        </div>
        <div className="width-full">
          <h2>Podcast Episode 2 - Explains how this dApp informs a trader's decisions.</h2>
          <YouTube src="https://www.youtube.com/embed/8B3UjcPlndg?si=ts6eI_cFsOdMJkfI" />
        </div>
      </div>

      <div className=" xl:columns-2 lg:columns-1 md:columns-1 sm:columns-1 xs:columns-1">
        <div className="width-full">
          <h2>Podcast Episode 3  - Explains the math behind the features being built into this dApp.</h2>
          <YouTube src="https://www.youtube.com/embed/FpXCyenlE4A?si=NjMEm4Pk8JOSGlIt" />
        </div>
        <div className="width-full">
          <h2>Podcast Episode 4  - Talks about the psychological guard rails being built into this dApp.</h2>
          <YouTube src="https://www.youtube.com/embed/oTpwT6h0Vg4?si=-clCy4wV8AfX8_ys" />
        </div>
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