import { useContext } from "react"
import { AuthContext } from "../../Contexts/Auth/index.tsx"

export const NavBar = () => {
  const auth = useContext(AuthContext)
  return (
    <div id='navbar' className="col-span-12 h-[3.75rem] bg-slate-800 px-4 flex items-center text-sky-100">
      Navbar {auth.isAuthenticated ? "Yes" : "No"} {auth.identity}
    </div>
  )
}

export default NavBar