import { PropsWithChildren, useRef, useContext } from 'react'
import { Positions } from '../../Components/Position'
import { CreatePositionModal } from '../../Components/Position/CreatePositionModal'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { PositionContext } from '../../Contexts/Position'

const PositionsScreenWrapper = (props: PropsWithChildren) => {
  const { children } = props
  const modalRef = useRef<HTMLDialogElement>(null)

  const openModal = () => {
    modalRef.current?.showModal()
  }

  return (
    <div className="text-center">
      <h1 className='text-2xl mb-4'>Positions</h1>
      <div className="relative h-14 mb-4">
        <button className="absolute btn btn-primary bg-slate-800 btn-outline right-0 uppercase" onClick={openModal}>
          <PlusCircleIcon className="h-6 w-6" />
          Position
        </button>
        <CreatePositionModal modalRef={modalRef} />
      </div>
      {children}
    </div>
  )
}

export const PositionsScreen = () => {
  const { positions } = useContext(PositionContext)

  // Guard for null or undefined positions.
  if (positions.length === 0) {
    return (
      <PositionsScreenWrapper>
        <div className='text-center'>To create a new position click the "+ position" button.</div>
      </PositionsScreenWrapper>
    )
  }

  return (
    <PositionsScreenWrapper>
      <Positions view='cards' />
    </PositionsScreenWrapper>
  )
}