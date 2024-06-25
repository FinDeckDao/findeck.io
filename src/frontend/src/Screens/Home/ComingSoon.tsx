import { Pricing } from "./Pricing"

export const ComingSoon = () => {
  return (
    <div className="container mx-auto text-center">
      <h1>Coming Soon</h1>

      <h2>Optimize your trading with data that supports your decisions</h2>
      <div className="text-left mb-8 text-center">
        <p>
          This project is being built in public so there isn't much here yet.
          Bookmark this page, follow us on Twitter/X, and Subscribe on YouTube.
        </p>
        <a href="https://twitter.com/almormd" target="_blank" rel="noreferrer"
          className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-2">
          Alex on X.com
        </a><br /><br />
        <a href="https://twitter.com/jfgrissom" target="_blank" rel="noreferrer"
          className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-2">
          Jay on X.com
        </a><br /><br />
        <a href="https://www.youtube.com/@AlexAndJayPodcast" target="_blank" rel="noreferrer"
          className="text-sky-400 hover:bg-slate-800 rounded-lg p-4 m-2">
          Alex and Jay Podcast on YouTube
        </a>
      </div >
      <Pricing />
    </div >
  )
}