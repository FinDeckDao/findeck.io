import { PropsWithChildren, useRef, useContext } from 'react'
import { Positions } from '../../Components/Position'
import { CreatePositionModal } from '../../Components/Position/CreatePositionModal'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { PositionContext } from '../../Contexts/Position'
import { DisplayContext } from '../../Contexts/Display'

const PositionsScreenWrapper = (props: PropsWithChildren) => {
  const { children } = props
  const modalRef = useRef<HTMLDialogElement>(null)
  const { display, setDisplay } = useContext(DisplayContext)

  const openModal = () => {
    modalRef.current?.showModal()
  }

  return (
    <div className="text-center">
      <h1 className='text-2xl mb-4'>Positions</h1>
      <div className="relative h-14 mb-4">
        {
          Positions.length < 1
            ?
            <span className="isolate inline-flex rounded-md shadow-sm float-start">
              <button
                className={`relative inline-flex btn btn-primary rounded-r-none px-3 py-2 uppercase ring-1 ring-inset focus:z-10 
                           ${display === "cards" ? 'bg-primary' : 'bg-slate-800 text-primary hover:text-black'}`}
                onClick={() => {
                  if (setDisplay) {
                    setDisplay('cards')
                    // Save the display type to local storage.
                    localStorage.setItem('display', JSON.stringify('cards'))
                  }
                }}>
                Cards
              </button>
              <button
                className={`relative -ml-px inline-flex btn btn-primary rounded-l-none px-3 py-2 uppercase ring-1 ring-inset focus:z-10
                           ${display === "table" ? 'bg-primary' : 'bg-slate-800 text-primary hover:text-black'}`}
                onClick={() => {
                  if (setDisplay) {
                    setDisplay('table')
                    // Save the display type to local storage.
                    localStorage.setItem('display', JSON.stringify('table'))
                  }
                }}>
                Table
              </button>
            </span>
            : null
        }
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
      <Positions />
    </PositionsScreenWrapper>
  )
}