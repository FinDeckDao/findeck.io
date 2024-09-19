import { FC, PropsWithChildren } from 'react'
import { useAuthState } from '@ic-reactor/react'
import { LoginButton } from './LoginButton'

export const Authenticate: FC<PropsWithChildren> = (props) => {
  const { authenticated, identity } = useAuthState()

  // Guard for unauthenticated user.
  if (!authenticated || !identity) {
    return (
      <div className="text-center py-4">
        <h1>Authentication Required</h1>
        <p>Please sign in to view this page.</p>
        <div className="w-32 mx-auto my-4">
          <LoginButton />
        </div>
      </div >
    )
  }

  return (
    <>
      {props.children}
    </>
  )
}