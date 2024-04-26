import { AuthClient } from "@dfinity/auth-client"
export const authClient = await AuthClient.create()

export const logOut = () => {
  window.sessionStorage.removeItem("authContext")
  authClient.logout()
  return
}