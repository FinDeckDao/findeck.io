import { Content } from "./Content"
import { NavBar } from "./NavBar"
import { SidePanel } from "./SidePanel"

export const Layout = () => {
  return (
    <div className='grid grid-cols-12 gap-4 w-full h-screen bg-red-300'>
      <NavBar />
      <Content />
      <SidePanel />
    </div>
  )
}

export default Layout