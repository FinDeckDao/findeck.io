import { FC } from 'react'
import iclogo from '../../Assets/internet-computer-icp-logo.svg'
import { useAuth } from "@ic-reactor/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  RectangleGroupIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface LoginButtonProps {
  dark?: boolean
}

export const LoginButton: FC<LoginButtonProps> = (props) => {
  const { dark } = props
  const { authenticated, identity, login, logout } = useAuth()
  const navigate = useNavigate()

  const navigateTo = (path: string) => {
    navigate(path)
  }

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
            identityProvider,
            onSuccess: () => navigateTo('/profile'),
          })
        }}
        className={`-mx-3 flex items-center justify-start rounded-lg px-3 py-2.5 text-base font-semibold leading-7
               text-sky-100 hover:bg-slate-700 ${dark ? 'bg-slate-800 hover:bg-slate-900' : ''}`}
      >
        <img src={iclogo} className="h-8 w-8 p-0" />
        <ArrowLeftEndOnRectangleIcon className='w-6 h-6 ml-2 mr-1 rotate-180' />
        <span>Login</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='px-3 py-2 rounded-lg hover:bg-slate-700 uppercase'>
        <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
        ({identity?.getPrincipal().toString().slice(0, 6)}...{identity?.getPrincipal().toString().slice(-4)})
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-black text-white rounded-lg'>
        <DropdownMenuItem
          onClick={() => navigateTo('/dashboard')}
          className='font-semibold bg-black text-white focus:bg-black focus:text-gray-400'
        >
          <RectangleGroupIcon className='w-6 h-6 mr-2' />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigateTo('/profile')}
          className='font-semibold bg-black text-white focus:bg-black focus:text-gray-400'
        >
          <UserCircleIcon className='w-6 h-6 mr-2' />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className='font-semibold bg-black text-white focus:bg-black focus:text-gray-400'
        >
          <ArrowLeftStartOnRectangleIcon className='w-6 h-6 mr-2 rotate-180' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
