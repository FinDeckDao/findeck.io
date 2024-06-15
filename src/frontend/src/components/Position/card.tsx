import { useRef, useState, useContext, FC } from "react"
import { Position } from "../../Contexts/Position"
import { OptionsModal } from "./OptionsModal"
import { PositionContext } from '../../Contexts/Position'
import { Link } from 'react-router-dom'
import { AssetPairContext } from "../../Contexts/AssetPair"
import { TradesContext } from "../../Contexts/Trade"

export const GetCards: FC = () => {
  const { positions } = useContext(PositionContext)

  const count = positions.length

  return (
    <div className={
      `grid grid-cols-1 gap-4 
      ${count >= 3 ? 'lg:grid-cols-3' : null} 
      ${count === 2 ? 'lg:grid-cols-2' : null} 
      ${count === 1 ? 'lg:grid-cols-1' : null}`}
    >
      {
        positions.filter((position) => position !== null).map((position, index) => (
          <PositionCard key={index} {...position} />
        ))
      }
    </div >
  )
}

// Individual Position Card
export const PositionCard = (props: Position) => {
  const { assetPair } = props
  const [currentValue, setCurrentValue] = useState<number | null>(null)
  const { setAssetPair } = useContext(AssetPairContext)
  const { trades } = useContext(TradesContext)
  const { base, quote } = assetPair

  // Guard against null trades.
  // TODO: Handle this in the Position Context when the trade is added to the position.
  const filteredTrades = trades.filter((trade) => trade !== null)

  const getTotalInvested = () => {
    // Get the value of all long trades.
    const longTrades = filteredTrades.filter((value) => {
      return value.type === "buy"
    })

    // Get the totals value of all long trades.
    const longTotal = longTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price
    }, 0)

    // Get the value of all short trades.
    const shortTrades = filteredTrades.filter((value) => {
      return value.type === "sell"
    })

    // Get the totals value of all short trades.
    const shortTotal = shortTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price
    }, 0)

    // Return the total value of the position.
    return longTotal - shortTotal
  }

  const getAssetsHeld = () => {
    // Get the value of all long trades.
    const longTrades = filteredTrades.filter((value) => {
      return value.type === "buy"
    })

    // Get the totals value of all long trades.
    const longTotal = longTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0)

    // Get the value of all short trades.
    const shortTrades = filteredTrades.filter((value) => {
      return value.type === "sell"
    })

    // Get the totals value of all short trades.
    const shortTotal = shortTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0)

    // Return the total value of the position.
    return longTotal - shortTotal
  }

  // const auth = useContext(AuthContext)
  const optionModalRef = useRef<HTMLDialogElement>(null)

  const openOptionsModal = () => {
    optionModalRef.current?.showModal()
  }

  const setPair = () => {
    const assetPair = { base, quote }
    if (setAssetPair) setAssetPair(assetPair)
  }

  const calcualteCostBasis = () => {
    return getTotalInvested() / getAssetsHeld()
  }

  const calculateRoi = (currentValue: number) => {
    return ((currentValue - calcualteCostBasis()) / calcualteCostBasis() * 100).toFixed(2)
  }

  return (
    <div className="bg-slate-800 shadow-xl rounded-xl">
      <div className="card-body">
        <h2 className="card-title">{base.symbol}/{quote.symbol}</h2>
        <p className="text-left mb-0"><span className="font-bold">Total Assets Held:</span> {getAssetsHeld().toLocaleString("en-US", { style: "decimal" })} ${base.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Total At Risk:</span> {getTotalInvested().toLocaleString("en-US", { style: "decimal" })} ${quote.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Cost Basis:</span> {calcualteCostBasis().toLocaleString("en-US", { style: "decimal" })} ${quote.symbol}</p>

        <label className='label block text-left font-bold'>Current Value of {base.symbol}
          <input
            type='number'
            className="input w-full"
            placeholder='Example: 13.00 - You can get this value from coinmarketcap.com'
            value={currentValue || ""}
            onChange={(e) => setCurrentValue(Number(e.currentTarget.value))}
          />
        </label>
        <p className="text-left mb-0"><span className="font-bold">Current ROI:</span> {currentValue ? `${calculateRoi(currentValue)}%` : `enter current value of ${base.symbol} to calculate`}</p>
        <p className="text-left mb-0"><span className="font-bold">Current Position Value:</span> {currentValue ? `${(getAssetsHeld() * currentValue).toLocaleString("en-US", { style: "decimal" })} $${quote.symbol}` : `enter current value of ${base.symbol} to calculate`}</p>

        <div className="card-actions justify-end">
          <button className="btn btn-primary mr-4 btn-outline uppercase" onClick={openOptionsModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Options
          </button>
          <Link to={'/trades'} className="btn btn-primary btn-outline uppercase" onClick={setPair}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            Trades
          </Link>
        </div>
        <OptionsModal modalRef={optionModalRef} />
      </div>
    </div>
  )
}