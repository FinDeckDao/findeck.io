import { PropsWithChildren } from "react"

export const Content = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <div
      id='content'
      className="col-span-12 md:col-span-8 bg-slate-800 h-[calc(100vh-150px)] p-4 text-sky-100">
      {children}
    </div>
  )
}

export default Content