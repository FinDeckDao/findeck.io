import { PropsWithChildren, useEffect, useState } from "react"
import { AuthClient } from "@dfinity/auth-client"
import { AuthContext, defaultAuthContext, AuthContextType } from "../../Contexts/Auth/index.tsx"
import { useLocation } from 'react-router-dom'

const authClient = await AuthClient.create()

// This component just handles presenting the results of the authorization process to this app.
// It's no meant to perform the actual authorization.
// This will present the status of the authorization process to the user.
// It will depend on a context to share the authorization status with the rest of the app.
// It depends on the dfinity auth-client library to perform the authorization.
export const Auth = (props: PropsWithChildren) => {
  const { children } = props
  const [authState, setAuthState] = useState<AuthContextType>(defaultAuthContext)
  const location = useLocation()
  const { pathname } = location

  // Takes authentication state from client library and adds it to the local app state.
  const handleAuthenticated = async (authClient: AuthClient) => {
    // Client library will check if the user is authenticated
    const authenticated = await authClient.isAuthenticated()
    const identity = await authClient.getIdentity()

    setAuthState({ isAuthenticated: authenticated, identity: identity.getPrincipal().toText() })
  }

  useEffect(() => {
    // Guard against forcing authentication on the home page.
    // TODO: Populate this with an array of pages that don't require authentication.
    //       For now this is simple enough and it works fine.
    if (pathname === '/') return

    // Force login for all other pages.
    if (!authState.isAuthenticated) {
      authClient.login({
        // 7 days in nanoseconds
        maxTimeToLive: BigInt(604800000000000),
        onSuccess: async () => {
          handleAuthenticated(authClient)
        },
        onError: (err) => {
          // TODO: Handle this appropriately.
          console.log(err)
        }
      })
    }
  }, [authState, pathname])

  return <AuthContext.Provider value={authState}>
    {children}
  </AuthContext.Provider>
}

//TODO: Export a signout button that will call the authClient.logout() method.