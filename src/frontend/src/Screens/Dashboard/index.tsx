import { useContext } from 'react'
import { AuthContext } from '../../Contexts/Auth/index.tsx'

export const DashboardScreen = () => {
  const auth = useContext(AuthContext)

  return (
    <div className='container mx-auto items-center justify-center text-center'>
      <h1 className=' text-2xl'>Dashboard</h1>
      <p>Here are your stats {auth.identity}.</p>
    </div>
  )
}