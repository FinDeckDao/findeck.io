import { Content } from "./Content"
import { Footer } from "./Footer"
import { NavBar } from "./NavBar"
// import { SidePanel } from "./SidePanel"

interface LayoutProps {
  navBarOverride?: JSX.Element
  sidePanelOverride?: JSX.Element
  content?: JSX.Element
  children?: React.ReactNode
}

export const DefaultLayout = (props: LayoutProps) => {
  const {
    navBarOverride,
    //sidePanelOverride, 
    content,
    children
  } = props
  return (
    <div className='bg-dark'>
      {navBarOverride || <NavBar />}
      {/* {sidePanelOverride || <SidePanel />} */}
      <Content>{children || content}</Content>
      <Footer />
    </div>
  )
}

export default DefaultLayout