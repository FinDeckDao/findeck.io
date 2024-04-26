import { PropsWithChildren } from "react"

export const Content = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <div
      id='content'
      className="col-span-12 md:col-span-12 bg-slate-800 h-[calc(100vh-188px)] p-4 text-sky-100 rounded-lg">
      {children}
    </div>
  )
}

export default Content