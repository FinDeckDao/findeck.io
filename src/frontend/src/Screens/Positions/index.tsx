import { useRef } from 'react'
// import { useContext } from 'react'
// import { AuthContext } from '../../Contexts/Auth/index.tsx'
import { Positions } from '../../components/Position/index.tsx'
import { CreatePositionModal } from './CreatePositionModal.tsx'
import { PlusCircleIcon } from "@heroicons/react/24/outline"

export const PositionsScreen = () => {
  // const auth = useContext(AuthContext)
  const modalRef = useRef<HTMLDialogElement>(null)

  const openModal = () => {
    modalRef.current?.showModal()
  }

  return (
    <div className="text-center">
      <h1 className='text-4xl mb-4'>Positions</h1>
      <div className="relative h-14 mb-4">
        <button className="absolute btn btn-primary btn-outline right-0" onClick={openModal}>
          <PlusCircleIcon className="h-6 w-6" />
          Position
        </button>
        <CreatePositionModal modalRef={modalRef} />
      </div>
      {/* <p>Here are your positions {auth.identity}.</p> */}
      <Positions view='cards' />
    </div>
  )
}