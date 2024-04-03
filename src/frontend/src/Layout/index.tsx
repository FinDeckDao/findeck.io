import { Content } from "./Content"
import { Footer } from "./Footer"
import { NavBar } from "./NavBar"
import { SidePanel } from "./SidePanel"
import { Auth } from "../components/Auth"

interface LayoutProps {
  navBarOverride?: JSX.Element
  sidePanelOverride?: JSX.Element
  content?: JSX.Element
  children?: React.ReactNode
}

export const DefaultLayout = (props: LayoutProps) => {
  const { navBarOverride, sidePanelOverride, content, children } = props
  return <Auth>
    <div className='grid grid-cols-12 gap-4 w-full h-max bg-slate-700'>
      {navBarOverride || <NavBar />}
      {sidePanelOverride || <SidePanel />}
      <Content>{children || content}</Content>
      <Footer />
    </div>
  </Auth>

}

export default DefaultLayout