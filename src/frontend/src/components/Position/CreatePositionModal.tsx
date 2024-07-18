import { useState, useContext } from 'react'
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { SupportedAssets } from '../../../../fixtures/assets'
import { AuthContext } from '../../Contexts/Auth'
import { Position, PositionContext } from '../../Contexts/Position'
import { AssetSelector } from '../AssetSelector'
import { AssetPairContext } from '../../Contexts/AssetPair'
import { TradesContext, Trade } from '../../Contexts/Trade'

interface CreatePositionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
}

// Create Position Modal
// Gathers the necessary information to create a new position.
// Takes the data and updates two global states:
// 1. positions
// 2. trades
export const CreatePositionModal = (props: CreatePositionModalProps) => {
  const { modalRef } = props
  const auth = useContext(AuthContext)

  // There is a lot of state here but it's all local to this component.
  const [base, setBase] = useState<string>("")
  const [quote, setQuote] = useState<string>("")
  const [amount, setAmount] = useState<number | string>("")
  const [spent, setSpent] = useState<number | string>("")
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')

  // These are essential global states.
  const { positions, setPositions } = useContext(PositionContext)
  const { assetPair, setAssetPair } = useContext(AssetPairContext)
  const { trades, setTrades } = useContext(TradesContext)

  // Guard against missing global state.
  if (!setPositions || !setAssetPair) {
    console.error('Missing global state.')
    return
  }

  const handleSelectedBase = (value: string) => {
    // Find the selected asset pair from the list of supported asset pairs.
    const selectedAssetPair = SupportedAssets.find((asset) => {
      return asset.symbol === value
    })

    if (selectedAssetPair && setAssetPair) {
      setBase(selectedAssetPair.symbol)
      setAssetPair({ ...assetPair, base: selectedAssetPair })
    }
  }

  const handleSelectedQuote = (value: string) => {
    // Find the selected asset pair from the list of supported asset pairs.
    const selectedAssetPair = SupportedAssets.find((asset) => {
      return asset.symbol === value
    })

    if (selectedAssetPair && setAssetPair) {
      setQuote(selectedAssetPair.symbol)
      setAssetPair({ ...assetPair, quote: selectedAssetPair })
    }
  }

  const closeModal = () => {
    modalRef.current?.close()
  }

  // Adds the new trade to the trades array within the signal.
  const createNewPosition = () => {
    // Guard against missing inputs.
    if (!base || !quote || !amount || !spent || !date || !auth.isAuthenticated || !time) {
      alert(`Missing Inputs: 
      base: ${base} 
      quote: ${quote} 
      amount: ${amount} 
      spent: ${spent} 
      date: ${date}
      time: ${time}
      user: ${auth.identity}`)
      return
    }

    // // Inputs only allow us to set and get string values so we need to convert them to types we can use.
    const baseFromInput = SupportedAssets.find((asset) => asset.symbol === base)
    const quoteFromInput = SupportedAssets.find((asset) => asset.symbol === quote)

    // // Guard against missing base or missing quote.
    // // Somehow the user was able to select a base or quote that doesn't exist.
    if (!baseFromInput || !quoteFromInput) {
      console.error('Missing required inputs base and quote.')
      return
    }

    // Determine what the new position should be.
    // A new position is created only when the asset pair combination isn't being used 
    // in any other asset pair in the global state.
    const calculatedPosition = positions.filter((position) => {
      if (position.assetPair.base.symbol === baseFromInput.symbol
        && position.assetPair.quote.symbol === quoteFromInput.symbol) {
        return position
      }
      if (position.assetPair.base.symbol === quoteFromInput.symbol
        && position.assetPair.quote.symbol === baseFromInput.symbol) {
        return position
      }
    })

    // This handles 2 cases.
    // 1. A new position is created when the calculated position doesn't exist using the base/quote inputs.
    // 2. A new position is created when the calculated position does exist using the existing position.
    const newPosition: Position = {
      assetPair: calculatedPosition.length > 0 ? calculatedPosition[0].assetPair : { base: baseFromInput, quote: quoteFromInput },
      owner: auth.identity,
      price: 0,
      priceDate: new Date(0).toISOString()
    }

    // Find an existing position.
    const existingPosition = positions.find((position) => {
      // There are two conditions that establish an existing position.

      // 1. The asset pair is the same (buy).
      if (position.assetPair.base.symbol === newPosition.assetPair.base.symbol
        && position.assetPair.quote.symbol === newPosition.assetPair.quote.symbol
        && position.owner === auth.identity) {
        return position
      }

      // 2. The asset pair is the same but reversed (sell).
      if (position.assetPair.base.symbol === newPosition.assetPair.quote.symbol
        && position.assetPair.quote.symbol === newPosition.assetPair.base.symbol
        && position.owner === auth.identity) {
        return position
      }
    })

    // Handle a new position (add).
    if (!existingPosition) {
      // Add the new position to the global state.
      setPositions([...positions, newPosition])

      // Save the new position to the local storage.
      localStorage.setItem('positions', JSON.stringify([...positions, newPosition]))
    }

    // Find an existing trade.
    const existingTrade = trades.find((trade) => {
      return trade.date === date
        && trade.time === time
        && trade.assetPair.base.symbol === base
        && trade.assetPair.quote.symbol === quote
    })

    const orderType = (() => {
      if (baseFromInput === existingPosition?.assetPair.base
        && quoteFromInput === existingPosition?.assetPair.quote) {
        return 'buy'
      }
      if (baseFromInput === existingPosition?.assetPair.quote
        && quoteFromInput === existingPosition?.assetPair.base) {
        return 'sell'
      }

      // Default to buy. For now this will work.
      // TODO: Move things around so that this case is never reached.
      return 'buy'
    })

    // Create a new trade.
    const newTrade: Trade = {
      amount: Number(amount),
      price: Number(spent),
      type: orderType(), // TODO: This should be dynamically determined by the asset Pair.
      date: date,
      time: time,
      assetPair: existingPosition ? existingPosition.assetPair : {
        base: baseFromInput,
        quote: quoteFromInput
      }
    }

    // Guard against missing global state.
    if (!setTrades) {
      console.error('Missing global state.')
      return
    }

    // Handle new trade (add).
    if (!existingTrade) {
      // Add the new trade to the global state.
      setTrades([...trades, newTrade])

      // Save the new trade to the local storage.
      localStorage.setItem('trades', JSON.stringify([...trades, newTrade]))
    }

    // To handle a duplicate position we do nothing.
    // To handle a duplicate trade we do nothing.
    closeModal()
    return
  }

  // Clear the position form.
  const clearInputs = () => {
    setBase('')
    setQuote('')
    setAmount('')
    setSpent('')
    setDate('')
    setTime('')
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
            <AssetSelector
              value={base}
              setValue={handleSelectedBase}
              defaultMessage="Select the asset you purchased."
            />
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
            <AssetSelector
              value={quote}
              setValue={handleSelectedQuote}
              defaultMessage="Select the asset you paid with."
            />
          </label>

          <label className="label block">Amount Spent
            <input
              type="number"
              className="input w-full bg-slate-800 mt-1 mb-4"
              placeholder="Example: 9.11"
              value={spent}
              onChange={(e) => setSpent(e.currentTarget.value)} />
          </label>

          <label className="label block">Date Of Trade
            <input
              type="text"
              className="input w-full bg-slate-800"
              placeholder="Example: 5/5/2024"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="label block">Time Of Trade
            <input
              type="text"
              className="input w-full bg-slate-800"
              placeholder="Example: 12:30AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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