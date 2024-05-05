import { TradeProps } from "../Trade"
import { Trade } from "../Trade"

interface TradesModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
  trades: TradeProps[]
}

export const TradesModal = (props: TradesModalProps) => {
  const { modalRef, trades } = props

  const closeModal = () => {
    modalRef.current?.close()
  }

  return (
    <dialog className="modal" ref={modalRef}>
      <div className="modal-box min-w-3/4">
        <form method="dialog">
          {/* if there is a button in the dialog form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Trades</h3>
        {
          trades.map((trade, index) => {
            return <Trade key={index} {...trade} />
          })
        }
        <div className='modal-action'>
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </dialog>
  )
}