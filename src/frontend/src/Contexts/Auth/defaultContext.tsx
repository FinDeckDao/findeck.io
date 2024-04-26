export type AuthContextType = {
  isAuthenticated: boolean
  identity: string
}

// Check session storage to see if this data has been stored.
// If it has been stored previously (and is not expired) then we can set it as the default value.
const authContext = window.sessionStorage.getItem("authContext")

// If the authContext is not null, then we can parse it and use it as the default value.
// Otherwise, we will use the default value.

export const defaultAuthContext: AuthContextType = authContext
  ? JSON.parse(authContext)
  : { isAuthenticated: false, identity: "" }

