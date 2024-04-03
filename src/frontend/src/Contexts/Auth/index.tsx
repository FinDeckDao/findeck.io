import { createContext } from "react"
import { AuthContextType, defaultAuthContext } from "./defaultContext"

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export default AuthContext