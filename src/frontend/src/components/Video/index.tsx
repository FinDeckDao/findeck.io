import { FC } from 'react'

export interface YouTubeProps {
  src: string
  width?: number
  height?: number
}

export const YouTube: FC<YouTubeProps> = (props) => {
  const { src, width, height } = props
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