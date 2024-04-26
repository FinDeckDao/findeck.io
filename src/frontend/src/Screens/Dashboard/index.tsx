import { useContext } from 'react'
import { AuthContext } from '../../Contexts/Auth/index.tsx'

export const DashboardScreen = () => {
  const auth = useContext(AuthContext)

  return <div>
    <h1>Dashboard</h1>
    <p>Here are your stats {auth.identity}.</p>
  </div>
}