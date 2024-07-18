import { PropsWithChildren, useEffect, useState, useContext } from "react"
import { AuthContext } from "../../Contexts/Auth/index.tsx"
import { defaultAuthContext, AuthContextType } from '../../Contexts/Auth/defaultContext.tsx'
import { useLocation } from 'react-router-dom'
import { authClient } from "./authClient.tsx"
import { AuthError } from "./Error.tsx"

export const Auth = (props: PropsWithChildren) => {
  const { children } = props
  const [authState, setAuthState] = useState<AuthContextType>(defaultAuthContext)
  const location = useLocation()
  const { pathname } = location

  // Takes authentication state from client library and adds it to the local app state.
  const handleAuthentication = async () => {
    authClient.login({
      // TODO: Add the identity provider URL to the environment variables.
      //       Use local II for development and public II for production.
      // identityProvider: process.env.II_URL,

      // 8 hours in nanoseconds
      maxTimeToLive: BigInt(28800000000000),
      onSuccess: async () => {
        // Client library will check if the user is authenticated
        const authenticated = await authClient.isAuthenticated()
        const identity = await authClient.getIdentity()

        // Write the authentication state to the session storage (to be used if the app refreshes).
        window.sessionStorage.setItem("authContext", JSON.stringify({ isAuthenticated: authenticated, identity: identity.getPrincipal().toText() }))

        // Set the authentication state in the app.
        setAuthState({ isAuthenticated: authenticated, identity: identity.getPrincipal().toText() })
      },
      onError: (err) => {
        // TODO: Handle this appropriately by showing an error message component.
        // For now this works.
        console.log(err)
      }
    })
  }

  useEffect(() => {
    // Guard against forcing authentication on the home page.
    // TODO: Populate this with an array of pages that don't require authentication.
    //       For now this is simple enough and it works fine.
    // TODO: Make this a configuration Option.
    if (pathname === '/') return

    // Force login for all other pages.
    if (!authState.isAuthenticated) {
      // First check to see if a user session exists.
      const authContext = window.sessionStorage.getItem("authContext")

      // Guard for missing AuthContext
      if (!authContext) {
        handleAuthentication()
        // If it doesn't exist then we will need to authenticate the user.
      }
      // If it exists then we can use it to authenticate the user.

    }
  }, [authState, pathname])

  return <AuthContext.Provider value={authState}>
    {children}
  </AuthContext.Provider>
}

export const ProtectedContent = (props: PropsWithChildren) => {
  const { children } = props
  const auth = useContext(AuthContext)

  // TODO: Check for identity using a regex match. For now this will work.
  if (!auth.isAuthenticated && auth.identity !== "") {
    return <AuthError />
  }

  return <>{children}</>
}

//TODO: Export a signout button that will call the authClient.logout() method.