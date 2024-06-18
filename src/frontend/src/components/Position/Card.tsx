import { useRef, useState, useContext, FC, useEffect } from "react"
import { Position } from "../../Contexts/Position"
import { OptionsModal } from "./OptionsModal"
import { PositionContext } from '../../Contexts/Position'
import { Link } from 'react-router-dom'
import { TradesContext } from "../../Contexts/Trade"
import { AssetPairContext } from "../../Contexts/AssetPair"
import { DeleteButton } from "../Buttons/Delete"
import { ConfirmDeleteModal } from "./ConfirmDeleteModal"
import { deletePosition, updatePosition } from "../../Contexts/Position/helpers"

export const GetPositionCards: FC = () => {
  const { positions } = useContext(PositionContext)
  const count = positions.length

  const cleanPositions = positions.filter((position) => position !== null)

  return (
    <div className={
      `grid grid-cols-1 gap-4
      ${count >= 3 ? 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1' : null} 
      ${count === 2 ? 'lg:grid-cols-2' : null} 
      ${count === 1 ? 'lg:grid-cols-1' : null}`}
    >
      {
        cleanPositions.map((position, index) => (
          <PositionCard key={index} position={position} />
        ))
      }
    </div >
  )
}

interface PositionCardProps {
  position: Position
}

// Individual Position Card
export const PositionCard = (props: PositionCardProps) => {
  const { position } = props
  const { assetPair } = position
  const [currentValue, setCurrentValue] = useState<number | null>(null)
  const { trades, setTrades } = useContext(TradesContext)
  const { setAssetPair } = useContext(AssetPairContext)
  const { positions, setPositions } = useContext(PositionContext)

  // Guard against null trades.
  // TODO: Handle this in the Position Context when the trade is added to the position.
  const cleanTrades = trades.filter((trade) => trade !== null)

  const filteredTrades = cleanTrades.filter((trade) => {
    return trade.assetPair.base.symbol === assetPair.base.symbol
      && trade.assetPair.quote.symbol === assetPair.quote.symbol
  })

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
    if (setAssetPair) {
      setAssetPair(assetPair)
    }
  }

  const calculateCostBasis = () => {
    return getTotalInvested() / getAssetsHeld()
  }

  const calculateRoi = (currentValue: number) => {
    return ((currentValue - calculateCostBasis()) / calculateCostBasis() * 100).toFixed(2)
  }

  // const auth = useContext(AuthContext)
  const deleteConfirmationModalRef = useRef<HTMLDialogElement>(null)

  const openDeleteConfirmationModal = () => {
    deleteConfirmationModalRef.current?.showModal()
  }

  // Handle fetching the current value of the asset from the API.
  useEffect(() => {
    // Handles the updating of the position price data.
    // Define header for the fetch request.
    const headers = new Headers()
    headers.append('X-CMC_PRO_API_KEY', 'de24431a-dbd0-4b91-8eef-221a85004add')

    const updatePriceData = () => {
      fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${assetPair.base.symbol}`, { headers })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          const newPosition = {
            ...position,
            price: data.quotes.USD.price,
            priceDate: new Date().toISOString()
          }
          updatePosition({ positions, position: newPosition, setter: setPositions })
        }).catch((error) => {
          // TODO: Handle this error more gracefully (present something to the user).
          console.error(error)
        })
    }

    // If there is no price data, we'll fetch the current price from the coinpaprika api.
    if (!position.price && !position.priceDate) {
      updatePriceData()
    }

    // If there is price data, we'll only update it if it's more than an hour old.
    if (position.price && position.priceDate) {
      // If the price is more than 1 hours old, we'll use the cached price.
      const priceDate = new Date(position.priceDate)
      const currentDate = new Date()

      // If the price is more than 1 hour old, we'll use the cached price.
      if (currentDate.getTime() - priceDate.getTime() > 3600000) {
        // If we don't have a cached price, we'll fetch the current price from the coinpaprika api.
        updatePriceData()
      }
    }
  }, [])

  return (
    <div className="bg-slate-800 shadow-xl rounded-xl">
      <div className="card-body p-4">
        <h2 className="card-title">{assetPair.base.symbol}/{assetPair.quote.symbol}</h2>
        <p className="text-left mb-0"><span className="font-bold">Total Assets Held:</span> {getAssetsHeld().toLocaleString("en-US", { style: "decimal" })} ${assetPair.base.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Total At Risk:</span> {getTotalInvested().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Cost Basis:</span> {calculateCostBasis().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}</p>

        <label className='label block text-left font-bold'>Current Value of {assetPair.base.symbol}
          <input
            type='number'
            className="input w-full"
            placeholder='Example: 13.00 - You can get this value from coinmarketcap.com'
            value={currentValue || ""}
            onChange={(e) => setCurrentValue(Number(e.currentTarget.value))}
          />
        </label>
        <p className="text-left mb-0">
          <span className="font-bold">Current ROI: </span>
          {currentValue
            ? `${calculateRoi(currentValue)}%`
            : `enter current value of ${assetPair.base.symbol} to calculate`}
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Current Position Value: </span>
          {currentValue
            ? `${(getAssetsHeld() * currentValue).toLocaleString("en-US", { style: "decimal" })} $${assetPair.quote.symbol}`
            : `enter current value of ${assetPair.base.symbol} to calculate`}
        </p>
        <div className="card-actions justify-end">
          <div className="flex justify-between w-full">
            <DeleteButton onClick={openDeleteConfirmationModal} />
            <div>
              <button className="btn btn-primary btn-outline uppercase mr-1 mb-2" onClick={openOptionsModal}>
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
          </div>
        </div>
        <OptionsModal modalRef={optionModalRef} />
        <ConfirmDeleteModal
          modalRef={deleteConfirmationModalRef}
          deleteAction={() => deletePosition(
            { positions, position, setter: setPositions, trades, tradeSetter: setTrades }
          )}
        />
      </div>
    </div>
  )
}