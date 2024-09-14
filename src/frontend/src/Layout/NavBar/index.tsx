import {
  useState
} from "react"
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom"
import { navigation } from "../../Routes"
import { LoginButton } from "../../Components/Authenticate/LoginButton"

export const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const domain = "FinDeck.io"

  if (mobileMenuOpen) {
    return (
      <header className="col-span-12 bg-slate-800 text-sky-100">
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto
                                bg-slate-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          >
            <div className="flex items-center justify-between">
              <Link to="#" className="text-sky-100 font-bold">{domain}</Link>
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
                      className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-sky-100
                               hover:bg-slate-700 uppercase"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <LoginButton />
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header >
    )
  }

  return <header className="col-span-12 bg-slate-800 text-sky-100">
    <nav className="mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <Link to="/" className="text-sky-100 font-bold hover:bg-slate-700 block rounded-lg px-3 py-2.5">
          {domain}
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
        <LoginButton />
      </div>
    </nav>
  </header >
}

export default NavBar