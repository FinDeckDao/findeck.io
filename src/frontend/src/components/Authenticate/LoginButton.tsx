import { FC } from 'react'
import iclogo from '../../Assets/internet-computer-icp-logo.svg'
import { useAuth } from "@ic-reactor/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface LoginButtonProps {
  dark?: boolean
}

export const LoginButton: FC<LoginButtonProps> = (props) => {
  const { dark } = props
  const { authenticated, identity, login, logout } = useAuth()

  // Guard for unauthenticated user or login error
  if (!authenticated || !identity) {
    const isLocal = window.location.hostname.includes('localhost')
    const identityProvider = isLocal
      ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:8000/#authorize`
      : 'https://identity.ic0.app/#authorize'
    return (
      <div
        onClick={(e) => {
          e.preventDefault()
          login({
            identityProvider
          })
        }}
        className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7
                   text-sky-100 hover:bg-slate-700 ${dark ? 'bg-slate-800 hover:bg-slate-900' : null}`}
      >
        <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
        Login
      </div>
    )
  }

  return (
    <Select>
      <SelectTrigger className="w-[180px] bg-black text-white">
        <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
        {identity?.getPrincipal().toString().slice(0, 6)}...{identity?.getPrincipal().toString().slice(-4)}
        {/* <SelectValue>Testing</SelectValue> */}
      </SelectTrigger>
      <SelectContent className="bg-black text-white">
        <SelectItem value="light">Profile</SelectItem>
        <SelectItem value="system">Logout</SelectItem>
      </SelectContent>
    </Select>

  )



  // <a
  //   href="/"
  //   className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7
  //                text-sky-100 hover:bg-slate-700 ${dark ? 'bg-slate-800 hover:bg-slate-900' : null}`}
  //   onClick={() => { logout() }}
  // >
  //   <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
  //   Logout ({identity?.getPrincipal().toString().slice(0, 6)}...{identity?.getPrincipal().toString().slice(-4)})
  // </a>
}
