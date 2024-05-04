import { PropsWithChildren } from "react"

export const Content = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <div
      id='content'
      className="bg-slate-700 p-4 text-sky-100">
      {children}
    </div>
  )
}

export default Content