import { FC } from "react"
import { Pricing } from "./Pricing"
import { YouTubeChannelFeed } from "../../Components/Video"
// import { YouTube } from "../../Components/Video"
import GrantWinner from "../../assets/Dfinity_processed.png"

export const ComingSoon: FC = () => {
  return (
    <>
      {/* Grant Winner logo aligned to the right, no top/bottom margins */}
      <div className="flex justify-center mt-0 mb-0">
        <img src={GrantWinner} alt="Dfinity Developer Grant Winner" className="h-60" />
      </div>

      <div className="container mx-auto">
        <h1 className="text-left text-3xl font-bold mb-8">Coming Soon</h1>

        <div>
          <YouTubeChannelFeed channelId="UCtOZqj1v82Vq7NpmpTlgsWw" />
        </div>

        <div className="mb-8 text-center">
          <p>
            To stay in touch we have some options, bookmark this site, follow us on Twitter/X, and Subscribe on YouTube.
            {/* Subheading and description */}
            <h2 className="text-left text-2xl mb-4">Optimize your trading with data that supports your decisions</h2>
          </p>
          <p className="text-left mb-8">
            This project is being built in public so there isn't much here yet,
            but we are working on this every day.
          </p>

          {/* Podcast section */}
          {/* <div className="mb-8 mx-auto">
          <h2 className="text-xl font-semibold mb-2">Latest Podcast</h2>
          <YouTube videoId="40dYts0hCvc" />
        </div> */}


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
      </div>
    </>
  )
}

