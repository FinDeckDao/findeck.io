import { Content } from "./Content"
import { NavBar } from "./NavBar"
import { SidePanel } from "./SidePanel"

type Props = {
  children?: React.ReactNode
  content?: React.ReactNode
  navBarOverride?: React.ReactNode
  sidePanelOverride?: React.ReactNode
}

export const Layout = (props: Props) => {
  const { children, content, navBarOverride, sidePanelOverride } = props

  return (
    <div className='grid grid-cols-12 gap-4 w-full h-screen bg-red-300'>
      {navBarOverride || <NavBar />}
      <Content>{children || content}</Content>
      {sidePanelOverride || <SidePanel />}
    </div>
  )
}

export default Layout