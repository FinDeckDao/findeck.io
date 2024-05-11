import { useState } from 'react'
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

interface CreatePositionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
}

export const CreatePositionModal = (props: CreatePositionModalProps) => {
  const { modalRef } = props

  const closeModal = () => {
    modalRef.current?.close()
  }

  const [base, setBase] = useState<string>('')
  const [quote, setQuote] = useState<string>('')
  const [amount, setAmount] = useState<number | null>(null)
  const [spent, setSpent] = useState<number | null>(null)
  const [marketPrice, setMarketPrice] = useState<number | null>(null)


  const savePosition = () => {
    // Update the positions in the frontend using the signal.
    console.log({
      user: '',
      positions: [
        {
          base: { symbol: base, name: base },
          quote: { symbol: quote, name: quote },
          trades: [
            {
              index: 1,
              amount: amount,
              price: marketPrice,
              type: 'buy',
              date: '2024-05-01',
              base: { symbol: base, name: base },
              quote: { symbol: quote, name: quote }
            }
          ]
        }
      ]
    })
    closeModal()
  }

  const clearPosition = () => {
    setBase('')
    setQuote('')
    setAmount(null)
    setSpent(null)
    setMarketPrice(null)
  }

  return (
    <dialog className="modal w-min-full" ref={modalRef} >
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in the dialog form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <XCircleIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </form>
        <h3 className="font-bold text-lg">New Position {base && quote ? `(${base}/${quote})` : null}</h3>

        <form className="text-left">
          <label className="label block">Base (Asset you bought)
            <input
              type="text"
              className="input w-full bg-slate-800"
              placeholder="Example: ICP"
              value={base}
              onChange={(e) => setBase(e.target.value)}
            />
          </label>
          <label className="label block">Amount Purchased
            <input
              type="number"
              className="input w-full bg-slate-800"
              value={Number(amount)}
              onChange={(e) => setAmount(Number(e.currentTarget.value))} />
          </label>

          <label className="label block">Quote (asset you paid with)
            <input
              type="text"
              className="input w-full bg-slate-800"
              placeholder="Example: USD"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </label>

          <label className="label block">Spent
            <input
              type="number"
              className="input w-full bg-slate-800"
              placeholder="Example: 1"
              value={Number(spent)}
              onChange={(e) => setSpent(Number(e.currentTarget.value))} />
          </label>

          <label className="label block">Current Market Price
            <input
              type="number"
              className="input w-full bg-slate-800"
              value={Number(marketPrice)}
              onChange={(e) => setMarketPrice(Number(e.currentTarget.value))} />
          </label>

          <label className="label block">Date of trade
            <input
              type="text"
              className="input w-full bg-slate-800"
              placeholder="Example: 5/5/2024"
            />
          </label>
        </form>
        <div //className='modal-action'
        >
          <button className="btn btn-ghost float-start" onClick={savePosition}>
            <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
            {" "}Save
          </button>
          <button className="btn btn-ghost float-end" onClick={clearPosition}>
            <XCircleIcon className="h-6 w-6" aria-hidden="true" />
            {" "}Clear
          </button>
        </div>
      </div>
    </dialog >
  )
}