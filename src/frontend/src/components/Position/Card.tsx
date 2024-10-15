import { useRef, useContext, FC, useState } from "react"
import { Position } from "../../Contexts/Position"
import { OptionsModal } from "./OptionsModal"
import { PositionContext } from '../../Contexts/Position'
import { Link } from 'react-router-dom'
import { TradesContext } from "../../Contexts/Trade"
import { AssetPairContext } from "../../Contexts/AssetPair"
import { DeleteButton } from "../Buttons/Delete"
import { ConfirmDeleteModal } from "./ConfirmDeleteModal"
import { deletePosition } from "../../Contexts/Position/helpers"
// import { backend } from "../../../../declarations/backend"
// import { updatePosition } from "../../Contexts/Position/helpers"

interface GetPositionCardsProps {
  positions: Partial<Position>[]
}

export const GetPositionCards: FC<GetPositionCardsProps> = (props) => {
  const { positions } = props
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

interface PartialPositionCardProps {
  position: Partial<Position>
}

export const PositionCard: React.FC<PartialPositionCardProps> = ({ position }) => {
  const { assetPair } = position
  const { trades, setTrades } = useContext(TradesContext)
  const { setAssetPair } = useContext(AssetPairContext)
  const { positions, setPositions } = useContext(PositionContext)
  const [price] = useState<number | undefined>(10)
  const [fetching] = useState<boolean>(false)

  const filteredTrades = trades.filter((trade) =>
    trade?.assetPair.base.symbol === assetPair?.base.symbol &&
    trade?.assetPair.quote.symbol === assetPair?.quote.symbol
  )

  const getTotalInvested = () => {
    const longTotal = filteredTrades
      .filter(trade => trade?.type === "buy")
      .reduce((acc, trade) => acc + (trade?.price || 0), 0)

    const shortTotal = filteredTrades
      .filter(trade => trade?.type === "sell")
      .reduce((acc, trade) => acc + (trade?.price || 0), 0)

    return longTotal - shortTotal
  }

  const getAssetsHeld = () => {
    const longTotal = filteredTrades
      .filter(trade => trade?.type === "buy")
      .reduce((acc, trade) => acc + (trade?.amount || 0), 0)

    const shortTotal = filteredTrades
      .filter(trade => trade?.type === "sell")
      .reduce((acc, trade) => acc + (trade?.amount || 0), 0)

    return longTotal - shortTotal
  }

  const calculateCostBasis = () => {
    const assetsHeld = getAssetsHeld()
    return assetsHeld !== 0 ? getTotalInvested() / assetsHeld : 0
  }

  const calculateRoi = (currentValue: number) => {
    const costBasis = calculateCostBasis()
    return costBasis !== 0 ? ((currentValue - costBasis) / costBasis * 100).toFixed(2) : '0.00'
  }

  const optionModalRef = useRef<HTMLDialogElement>(null)
  const deleteConfirmationModalRef = useRef<HTMLDialogElement>(null)

  const openOptionsModal = () => optionModalRef.current?.showModal()
  const openDeleteConfirmationModal = () => deleteConfirmationModalRef.current?.showModal()

  const setPair = () => {
    if (setAssetPair && assetPair) {
      setAssetPair(assetPair)
    }
  }

  if (!assetPair) {
    return <div>Loading position data...</div>
  }

  return (
    <div className="bg-dark shadow-xl rounded-xl">
      <div className="card-body p-4">
        <h2 className="card-title">{assetPair.base.symbol}/{assetPair.quote.symbol}</h2>
        <p className="text-left mb-0">
          <span className="font-bold">Total Assets Held: </span>
          {getAssetsHeld().toLocaleString("en-US", { style: "decimal" })} ${assetPair.base.symbol}
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Total At Risk: </span>
          {getTotalInvested().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Cost Basis: </span>
          <span className={price && calculateCostBasis() < price ? "text-green-500" : "text-red-500"}>
            {calculateCostBasis().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
          </span>
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Current Value of {assetPair.base.symbol}: </span>
          {fetching ? "Getting Current Price" : price ?
            `${price.toLocaleString("en-US", { style: "decimal" })} $${assetPair.quote.symbol}` :
            "Price not available"
          }
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Current ROI: </span>
          {fetching ? "Waiting on Current Price" : price ?
            <span className={`${Number(calculateRoi(price)) > 0 ? "text-green-500" : "text-red-500"}`}>
              {calculateRoi(price)}%
            </span> :
            "ROI not available"
          }
        </p>
        <p className="text-left mb-0">
          <span className="font-bold">Current Position Value: </span>
          {fetching ? "Waiting on Current Price" : price ?
            <span className={getTotalInvested() < getAssetsHeld() * price ? "text-green-500" : "text-red-500"}>
              {(getAssetsHeld() * price).toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
            </span> :
            "Position value not available"
          }
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
        {/* <ConfirmDeleteModal
          modalRef={deleteConfirmationModalRef}
          deleteAction={() => deletePosition(
            { positions, position, setter: setPositions, trades, tradeSetter: setTrades }
          )}
        /> */}
      </div>
    </div>
  )
}