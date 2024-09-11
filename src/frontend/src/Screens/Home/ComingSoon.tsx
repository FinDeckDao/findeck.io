import { Pricing } from "./Pricing"
import { YouTube } from "../../Components/Video"

export const ComingSoon = () => {
  return (
    <>
     {/* Grant Winner logo aligned to the right, no top/bottom margins */}
     <div className="flex justify-center mt-0 mb-0">
  <img src="/assets/Dfinity_processed.png" alt="Dfinity Developer Grant Winner" className="h-60" />
</div>

      <div className="container mx-auto">
        <h1 className="text-left text-3xl font-bold mb-8">Coming Soon</h1>

        {/* Subheading and description */}
        <h2 className="text-left text-2xl mb-4">Optimize your trading with data that supports your decisions</h2>
        <p className="text-left mb-8">
          This project is being built in public so there isn't much here yet,
          but we are working on this every day.
        </p>

        {/* Podcast section */}
        <div className="xl:columns-2 lg:columns-1 md:columns-1 sm:columns-1 xs:columns-1 gap-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Podcast Episode 1 - Explains the goals of this dApp and why it's being built.</h2>
            <YouTube src="https://www.youtube.com/embed/yHnque24WHc?si=G6ShcswkkJfHSfQY" />
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Podcast Episode 2 - Explains how this dApp informs a trader's decisions.</h2>
            <YouTube src="https://www.youtube.com/embed/8B3UjcPlndg?si=ts6eI_cFsOdMJkfI" />
          </div>
        </div>

        <div className="xl:columns-2 lg:columns-1 md:columns-1 sm:columns-1 xs:columns-1 gap-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Podcast Episode 3 - Explains the math behind the features being built into this dApp.</h2>
            <YouTube src="https://www.youtube.com/embed/FpXCyenlE4A?si=NjMEm4Pk8JOSGlIt" />
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Podcast Episode 4 - Talks about the psychological guard rails being built into this dApp.</h2>
            <YouTube src="https://www.youtube.com/embed/oTpwT6h0Vg4?si=-clCy4wV8AfX8_ys" />
          </div>
        </div>

        {/* Social media links */}
        <div className="mb-8 text-center">
          <p className="mb-4">
            To stay in touch we have some options, bookmark this site, follow us on Twitter/X, and Subscribe on YouTube.
          </p>
          <a href="https://twitter.com/almormd" target="_blank" rel="noreferrer" className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-1 inline-block">
            Follow Alex on X.com
          </a><br />
          <a href="https://twitter.com/jfgrissom" target="_blank" rel="noreferrer" className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-1 inline-block">
            Follow Jay on X.com
          </a><br />
          <a href="https://www.youtube.com/@AlexAndJayPodcast" target="_blank" rel="noreferrer" className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-1 inline-block">
            Subscribe to Alex and Jay's Podcast on YouTube
          </a><br />
          <a href="https://oc.app/community/vmoft-nqaaa-aaaar-bh3pa-cai/?ref=ex43p-lqaaa-aaaar-bal2q-cai" target="_blank" rel="noreferrer" className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-1 inline-block">
            Share ideas or propose changes on OpenChat
          </a>
        </div>

        {/* Pricing component */}
        <Pricing />
      </div>
    </>
  )
}

