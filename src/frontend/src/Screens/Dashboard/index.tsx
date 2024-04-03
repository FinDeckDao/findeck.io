import { useContext } from 'react'
import { AuthContext } from '../../Contexts/Auth/index.tsx'
import { AuthError } from '../../components/Auth/Error.tsx'

export const DashboardScreen = () => {
  const auth = useContext(AuthContext)

  // TODO: Make this composable instead of a manual dependency.
  if (!auth.isAuthenticated) {
    return <AuthError />
  }

  return <div>
    <h1>Dashboard</h1>
    <p>Here are your stats.</p>
  </div>
}