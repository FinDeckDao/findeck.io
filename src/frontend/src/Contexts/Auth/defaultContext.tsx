export type AuthContextType = {
  isAuthenticated: boolean
  identity: string
}

export const defaultAuthContext: AuthContextType = { isAuthenticated: false, identity: "" }