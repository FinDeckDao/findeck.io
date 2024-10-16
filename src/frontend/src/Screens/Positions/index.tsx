import { PropsWithChildren, useRef, useContext } from 'react'
import { Positions } from '../../Components/Position'
import { CreatePositionModal } from '../../Components/Position/CreatePositionModal'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
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
      <h1 className="text-4xl font-bold text-center mb-6">Positions</h1>
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
  return (
    <PositionsScreenWrapper>
      <Positions />
    </PositionsScreenWrapper>
  )
}