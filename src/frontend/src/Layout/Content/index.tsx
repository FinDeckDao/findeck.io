import { PropsWithChildren } from "react"

export const Content = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <div
      id='content'
      className="bg-medium text-white pb-4 pt-4">
      {children}
    </div>
  )
}

export default Content