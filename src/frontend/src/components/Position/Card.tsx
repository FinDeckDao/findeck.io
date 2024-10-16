import React, { useRef, useContext, useState } from "react"
import { Link } from 'react-router-dom'
import { TradesContext } from "../../Contexts/Trade"
import { AssetPairContext } from "../../Contexts/AssetPair"
// import { PositionContext } from '../../Contexts/Position'
import { DeleteButton } from "../Buttons/Delete"
import { OptionsModal } from "./OptionsModal"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, List } from "lucide-react"
import { Position } from '../../../../declarations/position_manager/position_manager.did'
import { ROIBarChart } from './RoiBarChart'

interface PartialPositionCardProps {
  position: Partial<Position>
}

export const PositionCard: React.FC<PartialPositionCardProps> = ({ position }) => {
  const { assetPair } = position
  const { trades,
    //setTrades
  } = useContext(TradesContext)
  const { setAssetPair } = useContext(AssetPairContext)
  // const { positions, setPositions } = useContext(PositionContext)
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
      // setAssetPair(assetPair)
    }
  }

  if (!assetPair) {
    return <div>Loading position data...</div>
  }

  return (
    <Card className="w-full bg-gray-800 text-gray-100 shadow-lg rounded-2xl">
      <CardHeader className="border-b border-b-gray-700 pb-0 mb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 text-center">{assetPair.base.symbol}/{assetPair.quote.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between items-start">
          <div className="w-1/2 space-y-4 text-left">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Total Assets Held:</span>
              <span className="text-gray-300">
                {getAssetsHeld().toLocaleString("en-US", { style: "decimal" })} ${assetPair.base.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Total At Risk:</span>
              <span className="text-gray-300">
                {getTotalInvested().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Cost Basis:</span>
              <span className={price && calculateCostBasis() < price ? "text-green-400" : "text-red-400"}>
                {calculateCostBasis().toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current Value of {assetPair.base.symbol}:</span>
              <span className="text-gray-300">
                {fetching ? "Getting Current Price" : price ?
                  `${price.toLocaleString("en-US", { style: "decimal" })} $${assetPair.quote.symbol}` :
                  "Price not available"
                }
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current ROI:</span>
              {fetching ? (
                <span className="text-gray-300">Waiting on Current Price</span>
              ) : price ? (
                <span className={`${Number(calculateRoi(price)) > 0 ? "text-green-400" : "text-red-400"}`}>
                  {calculateRoi(price)}%
                </span>
              ) : (
                <span className="text-gray-300">ROI not available</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current Position Value:</span>
              {fetching ? (
                <span className="text-gray-300">Waiting on Current Price</span>
              ) : price ? (
                <span className={getTotalInvested() < getAssetsHeld() * price ? "text-green-400" : "text-red-400"}>
                  {(getAssetsHeld() * price).toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
                </span>
              ) : (
                <span className="text-gray-300">Position value not available</span>
              )}
            </div>
          </div>
          <div className="w-5/12 overflow-hidden">
            <div className="w-full h-full">
              <ROIBarChart roi={-100} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
        <DeleteButton onClick={openDeleteConfirmationModal} className="bg-red-600 hover:bg-red-700 text-white" />
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={openOptionsModal} className="bg-gray-700 text-gray-200 hover:bg-gray-600">
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Options
          </Button>
          <Button variant="outline" size="sm" asChild className="bg-gray-700 text-gray-200 hover:bg-gray-600">
            <Link to={'/trades'} onClick={setPair}>
              <List className="h-4 w-4 mr-2" />
              Trades
            </Link>
          </Button>
        </div>
      </CardFooter>
      <OptionsModal modalRef={optionModalRef} />
      {/* <ConfirmDeleteModal
        modalRef={deleteConfirmationModalRef}
        deleteAction={() => deletePosition(
          { positions, position, setter: setPositions, trades, tradeSetter: setTrades }
        )}
      /> */}
    </Card>
  )
}