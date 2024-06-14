import { useState, useContext } from 'react'
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { Asset, SupportedAssets } from '../../../fixtures/assets'
import { AuthContext } from '../../Contexts/Auth'
import {
  constructPosition,
  NewPositionProps,
  updatePositions,
  StorePositionsProps,
} from '../../Contexts/Position/helpers'
import { PositionContext } from '../../Contexts/Position'


interface CreatePositionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
}

export const CreatePositionModal = (props: CreatePositionModalProps) => {
  const { modalRef } = props
  const { positions, setPositions } = useContext(PositionContext)

  const auth = useContext(AuthContext)

  const closeModal = () => {
    modalRef.current?.close()
  }

  const [base, setBase] = useState<string>("")
  const [quote, setQuote] = useState<string>("")
  const [amount, setAmount] = useState<number | string>("")
  const [spent, setSpent] = useState<number | string>("")
  const [marketPrice, setMarketPrice] = useState<number | string>("")
  const [date, setDate] = useState<string>('')

  // Adds the new trade to the trades array within the signal.
  const createNewPosition = () => {
    // Guard against missing inputs.
    if (!base || !quote || !amount || !spent || !marketPrice || !date || !auth.isAuthenticated) {
      alert(`Missing Inputs: 
      base: ${base} 
      quote: ${quote} 
      amount: ${amount} 
      spent: ${spent} 
      marketplace: ${marketPrice} 
      date: ${date}
      user: ${auth.identity}`)
      return
    }

    // Inputs only allow us to set and get string values so we need to convert them to types we can use.
    const baseFromInput = SupportedAssets.find((asset) => asset.symbol === base)
    const quoteFromInput = SupportedAssets.find((asset) => asset.symbol === quote)

    // Guard against missing base or missing quote.
    // Somehow the user was able to select a base or quote that doesn't exist.
    if (!baseFromInput || !quoteFromInput) {
      console.error('Missing required inputs base and quote.')
      return
    }

    // Create a new position object.
    const newPosition: NewPositionProps = {
      owner: auth.identity,
      positionBase: baseFromInput,
      positionQuote: quoteFromInput,
      tradeBase: baseFromInput,
      tradeQuote: quoteFromInput,
      amount: Number(amount),
      spent: Number(spent),
      date: date
    }

    // Store the position (storePosition handles details related to new 
    // or existing positions along with cache, global context, and ICP Stable Memory).
    const StorablePosition: StorePositionsProps = {
      positions: positions,
      position: constructPosition(newPosition),
    }

    const updatedPositions = updatePositions(StorablePosition)

    // Guard against failed update to the positions array.
    if (!updatedPositions || !setPositions) {
      console.error('Failed to store the position.')
      return
    }

    // Update the global state with the new position.
    // This is a hack that had to be done because the state wasn't updating.
    // This was caused by updating sub-objects within the state using the same reference.
    setPositions(prevState => {
      return [...prevState]
    })
    closeModal()
    return
  }

  // Clear the position form.
  const clearInputs = () => {
    setBase('')
    setQuote('')
    setAmount('')
    setSpent('')
    setMarketPrice('')
    setDate('')
  }

  // TODO: Dry this up.
  const handleSelectedBase = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAsset: Asset | undefined = SupportedAssets.find((asset) => {
      if (asset.symbol === event.currentTarget.value) {
        return asset.symbol
      }
    })

    if (selectedAsset) {
      setBase(selectedAsset.symbol)
    }
  }

  // TODO: Dry this up. There are basically the same function.
  //       MVP is to get it working.
  const handleSelectedQuote = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAsset: Asset | undefined = SupportedAssets.find((asset) => {
      if (asset.symbol === event.currentTarget.value) {
        return asset.symbol
      }
    })

    if (selectedAsset) {
      setQuote(selectedAsset.symbol)
    }
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
            <select
              className="select w-full mt-1 mb-4 bg-slate-800"
              onChange={handleSelectedBase}
              value={base}
            >
              <option disabled value=''>Select the asset you purchased.</option>
              {
                SupportedAssets.sort().map((asset) => {
                  return <option key={asset.symbol} value={asset.symbol}>${asset.symbol} ({asset.name})</option>
                })
              }
            </select>
          </label>
          <label className="label block">Amount Purchased
            <input
              type="number"
              className="input w-full bg-slate-800 mt-1 mb-4"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
              placeholder='Example: 589.589' />
          </label>

          <label className="label block">Quote (asset you paid with)
            <select
              className="select w-full mt-1 mb-4  bg-slate-800"
              onChange={handleSelectedQuote}
              value={quote}
            >
              <option disabled value=''>Select the asset you paid with.</option>
              {
                SupportedAssets.map((asset) => {
                  return <option key={asset.symbol} value={asset.symbol}>${asset.symbol} ({asset.name})</option>
                })
              }
            </select>
          </label>

          <label className="label block">Amount Spent
            <input
              type="number"
              className="input w-full bg-slate-800 mt-1 mb-4"
              placeholder="Example: 9.11"
              value={spent}
              onChange={(e) => setSpent(e.currentTarget.value)} />
          </label>

          <label className="label block">Current Market Price
            <input
              type="number"
              className="input w-full bg-slate-800 mt-1 mb-4"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.currentTarget.value)}
              placeholder='Example: 13.33' />
          </label>

          <label className="label block">Date of trade
            <input
              type="text"
              className="input w-full bg-slate-800"
              placeholder="Example: 5/5/2024"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </form>
        <div //className='modal-action'
        >
          <button className="btn btn-ghost float-start" onClick={createNewPosition}>
            <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
            {" "}Save
          </button>
          <button className="btn btn-ghost float-end" onClick={clearInputs}>
            <XCircleIcon className="h-6 w-6" aria-hidden="true" />
            {" "}Clear
          </button>
        </div>
      </div>
    </dialog >
  )
}