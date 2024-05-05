import { useContext, useState } from "react"
import { AuthContext } from "../../Contexts/Auth"
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom"
import iclogo from '../../Assets/internet-computer-icp-logo.svg'
import { AuthContextType } from "../../Contexts/Auth/defaultContext"
import { logOut } from "../../Components/Auth/authClient"
import { navigation } from "../../Routes"

export const NavBar = () => {
  const auth = useContext(AuthContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getLoginButton = (auth: AuthContextType) => {
    // Guard for unauthenticated user.
    if (!auth.isAuthenticated) {
      return <Link
        to="/dashboard"
        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-sky-100 hover:bg-slate-700"
      >
        <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
        Login
      </Link>
    }

    return <a
      href="/"
      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-sky-100 hover:bg-slate-700"
      onClick={() => { logOut() }}
    >
      <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
      Logout ({auth.identity.slice(0, 6)}...{auth.identity.slice(-4)})
    </a>
  }

  return <header className="col-span-12 bg-slate-800 text-sky-100 rounded-b-lg">
    {/* Default Menu */}
    <nav className="mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <Link to="/" className="text-sky-100 font-bold hover:bg-slate-700 block rounded-lg px-3 py-2.5">
          FinDeck.io
        </Link>
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="text-sm font-semibold leading-6 text-sky-100 hover:bg-slate-700 rounded-lg p-3"
          >
            {item?.icon} {item.name}
          </Link>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        {getLoginButton(auth)}
      </div>
    </nav>
    {/* Mobile Menu */}
    <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
      <div className="fixed inset-0 z-10" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link to="#" className="text-sky-100 font-bold">FinDeck.io</Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-sky-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-sky-100 hover:bg-slate-700 uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6">
              {getLoginButton(auth)}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  </header >
}

export default NavBar