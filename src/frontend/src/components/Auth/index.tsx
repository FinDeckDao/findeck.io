import { PropsWithChildren, useEffect, useState } from "react"
import { AuthClient } from "@dfinity/auth-client"

const authClient = await AuthClient.create()

// This component just handles presenting the results of the authorization process to this app.
// It's no meant to perform the actual authorization.
// This will present the status of the authorization process to the user.
// It will depend on a context to share the authorization status with the rest of the app.
// It depends on the dfinity auth-client library to perform the authorization.
export const Auth = (props: PropsWithChildren) => {
  const { children } = props

  // TODO: This state is local for now but will be in a context later
  //       default value should be false.
  //       Context needs to be global to site including non-authenticated routes.
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [identity, setIdentity] = useState<string>("")

  // Takes authentication state from client library and adds it to the local app state.
  const handleAuthenticated = async (authClient: AuthClient) => {
    // Client library will check if the user is authenticated
    const authenticated = await authClient.isAuthenticated()
    const identity = await authClient.getIdentity()

    if (identity) {
      setIdentity(identity.getPrincipal().toText())
      // TODO: Also need to setup an HttpAgent and bind it to this identity in order to make 
      // authenticated calls to the canisters. 
    }

    if (authenticated) {
      setIsAuthenticated(authenticated)
      return
    }
    console.log(authClient)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      authClient.login({
        // 7 days in nanoseconds
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        onSuccess: async () => {
          handleAuthenticated(authClient)
        },
      })
    }
  }, [isAuthenticated])

  return <>
    <h1>Auth Content</h1>
    <p>User Authenticaed: {isAuthenticated ? "Yes" : "No"}</p>
    <p>User: {identity}</p>
    {children}
  </>
}