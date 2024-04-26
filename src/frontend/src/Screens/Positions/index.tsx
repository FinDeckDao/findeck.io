// import { useContext } from 'react'
// import { AuthContext } from '../../Contexts/Auth/index.tsx'
import { Positions } from '../../components/Position/index.tsx'

export const PositionsScreen = () => {
  // const auth = useContext(AuthContext)

  return (
    <div className="text-center">
      <h1 className='text-4xl mb-4'>Positions</h1>
      {/* <p>Here are your positions {auth.identity}.</p> */}
      <Positions view='cards' />
    </div>
  )
}