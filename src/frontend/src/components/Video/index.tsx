import { FC, useState, useEffect } from 'react'

export interface YouTubeProps {
  videoId: string
  width?: number
  height?: number
}

export const YouTube: FC<YouTubeProps> = (props) => {
  const { width, height, videoId } = props
  return <div className="aspect-w-16 aspect-h-9 w-full ml-0">
    <iframe
      className="mx-auto my-auto mb-8"
      width={`${width || 360}`}
      height={`${height || 203}`}
      src={src}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    >
    </iframe>
  </div >
}

interface Video {
  id: string
  title: string
  link: string
  published: string
}

export const YouTubeChannelFeed: React.FC<{ channelId: string }> = ({ channelId }) => {
  const [latestVideo, setLatestVideo] = useState<Video | null>(null)

  useEffect(() => {
    const fetchLatestVideo = async () => {
      const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
        mode: 'no-cors'
      })
      const text = await response.text()
      const parser = new DOMParser()
      const xml = parser.parseFromString(text, 'application/xml')
      const entries = xml.getElementsByTagName('entry')

      if (entries.length > 0) {
        const entry = entries[0]
        const video: Video = {
          id: entry.getElementsByTagName('yt:videoId')[0].textContent || '',
          title: entry.getElementsByTagName('title')[0].textContent || '',
          link: entry.getElementsByTagName('link')[0].getAttribute('href') || '',
          published: entry.getElementsByTagName('published')[0].textContent || '',
        }
        setLatestVideo(video)
      }
    }

    fetchLatestVideo()
  }, [channelId])

  return (
    <div>
      {latestVideo ? (
        <div>
          <h3>Latest Video</h3>
          <p>{latestVideo.title}</p>
          <a href={latestVideo.link} target="_blank" rel="noopener noreferrer">
            Watch
          </a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
