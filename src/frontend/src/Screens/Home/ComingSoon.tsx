import { FC } from 'react'
import { Pricing } from "./Pricing"
import GrantWinner from "../../assets/Dfinity_processed.png"

export const ComingSoon: FC = () => {
  return (
    <>
      {/* Grant Winner logo aligned to the right, no top/bottom margins */}
      <div className="flex justify-center mt-0 mb-0">
        <img src={GrantWinner} alt="Dfinity Developer Grant Winner" className="h-60" />
      </div>

      <div className="container mx-auto">
        {/* Use flexbox to align text and video widget side by side */}
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Left side text content */}
          <div className="w-full md:w-1/2 px-4 mb-6 md:mb-0 text-center md:text-left"> {/* Добавлено выравнивание текста */}
            <h1>Coming Soon</h1>
            <h2 className="text-3xl mb-4">Optimize your trading with data that supports your decisions</h2>
            <p className="mb-8 text-lg">
              This project is being built in public so there isn't much here yet,
              but we are working on this every day.
            </p>
          </div>

          {/* Right side video widget */}
          <div className="w-full md:w-1/2 px-4 flex justify-center">
            <div className="text-center">
              <div className="text-white font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Check out our latest podcast episode
              </div>

              {/* Video container to maintain aspect ratio */}
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube-nocookie.com/embed/videoseries?list=PL--tYe1vMZqcvpYSCBX63aq7i3GvUlrFx&showinfo=0&modestbranding=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Latest Podcast Video"
                  className="absolute top-0 left-0 rounded-lg"
                  style={{ width: '100%', height: '100%', maxWidth: '560px', maxHeight: '315px' }} // Адаптивные размеры (Adaptive Sizes)
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social media links */}
        <div className="mb-8 text-center mt-8">
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

export default ComingSoon