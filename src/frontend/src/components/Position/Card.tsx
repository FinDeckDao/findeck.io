import { useRef, useContext, FC } from "react"
import { Position } from "../../Contexts/Position"
import { OptionsModal } from "./OptionsModal"
import { PositionContext } from '../../Contexts/Position'
import { Link } from 'react-router-dom'
import { TradesContext } from "../../Contexts/Trade"
import { AssetPairContext } from "../../Contexts/AssetPair"
import { DeleteButton } from "../Buttons/Delete"
import { ConfirmDeleteModal } from "./ConfirmDeleteModal"
import { deletePosition } from "../../Contexts/Position/helpers"

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
    return longTotal - shortTotal || 0
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
    return ((currentValue - calculateCostBasis()) / calculateCostBasis() * 100 || 0).toFixed(2)
  }

  // const auth = useContext(AuthContext)
  const deleteConfirmationModalRef = useRef<HTMLDialogElement>(null)

  const openDeleteConfirmationModal = () => {
    deleteConfirmationModalRef.current?.showModal()
  }

  return (
    <div className="bg-slate-800 shadow-xl rounded-xl">
      <div className="card-body p-4">
        <h2 className="card-title">{assetPair.base.symbol}/{assetPair.quote.symbol}</h2>
        <p className="text-left mb-0"><span className="font-bold">Total Assets Held:</span> {getAssetsHeld().toLocaleString("en-US", { style: "decimal" })} ${assetPair.base.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Total At Risk:</span> {getTotalInvested().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Cost Basis:</span> {calculateCostBasis().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}</p>
        <p className="text-left mb-0">
          <span className="font-bold">Current Value of {assetPair.base.symbol}: </span>
          {`${Number(position.price | 0).toLocaleString("en-US", { style: "decimal" })} $${assetPair.quote.symbol}`}
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Current ROI: </span>
          {calculateRoi((position.price | 0))}%
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Current Position Value: </span>
          {`${(getAssetsHeld() * (position.price | 0)).toLocaleString("en-US", { style: "decimal" })} $${assetPair.quote.symbol}`}
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