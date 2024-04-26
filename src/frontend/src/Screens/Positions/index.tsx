import { useContext } from 'react'
import { AuthContext } from '../../Contexts/Auth/index.tsx'

export const PositionsScreen = () => {
  const auth = useContext(AuthContext)

  return <div>
    <h1>Positions</h1>
    <p>Here are your positions {auth.identity}.</p>
  </div>
}