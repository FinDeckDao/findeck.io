import { FC } from 'react'
import { useAuthState } from '@ic-reactor/react'

export const ProfileScreen: FC = () => {
  const { identity } = useAuthState()

  return (
    <div className='container mx-auto items-center justify-center text-center min-w-max'>
      <h1 className='text-2xl'>Profile Screen</h1>
      <p><span className="font-extrabold">Your Internet Identity:</span> {identity?.getPrincipal().toString()}</p>
    </div>
  )
}