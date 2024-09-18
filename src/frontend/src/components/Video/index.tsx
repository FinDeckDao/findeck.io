import { FC } from 'react'

export interface YouTubeProps {
  videoId: string
  width?: number
  height?: number
}

export const YouTube: FC<YouTubeProps> = ({ videoId, width = 560, height = 315 }) => {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}`

  return (
    <div className="aspect-w-16 aspect-h-9 w-full">
      <iframe
        className="mx-auto my-auto mb-8"
        width={width}
        height={height}
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="YouTube video player"
      />
    </div>
  )
}