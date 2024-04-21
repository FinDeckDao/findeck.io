import { useContext } from 'react'
import { AuthContext } from '../../Contexts/Auth/index.tsx'
import { AuthError } from '../../components/Auth/Error.tsx'
import { Positions } from '../../components/Position/index.tsx'

export const PositionsScreen = () => {
  const auth = useContext(AuthContext)

  // TODO: Make this composable instead of a manual dependency.
  if (!auth.isAuthenticated) {
    return <AuthError />
  }

  return <div>
    <h1>Positions</h1>
    <Positions />
  </div>
}