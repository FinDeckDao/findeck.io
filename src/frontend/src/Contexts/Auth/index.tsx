import { createContext } from "react"

type AuthContextType = "test" | "test2"

export const AuthContext = createContext<AuthContextType>("test")