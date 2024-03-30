import { PropsWithChildren } from "react"

export const Content = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <div
      id='content'
      className="col-span-12 md:col-span-8 bg-blue-300 h-[calc(100vh-120px)] p-4"
    >
      {children}
    </div>
  )
}

export default Content