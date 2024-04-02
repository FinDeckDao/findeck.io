import { createContext } from "react"

export type AuthContextType = {
  isAuthenticated: boolean
  identity: string
}

export const defaultAuthContext: AuthContextType = { isAuthenticated: false, identity: "" }

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export default AuthContext