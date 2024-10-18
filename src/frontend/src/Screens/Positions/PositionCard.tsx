import { useRef, useState, FC, useEffect } from "react"
import { Link } from 'react-router-dom'
import { OptionsModal } from "../../Components/Position/OptionsModal"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, List } from "lucide-react"
import { Position } from '../../../../declarations/position_manager/position_manager.did'
import { ROIBarChart } from '../../Components/Position/RoiBarChart'
import { Trade } from "../../../../declarations/trade_manager/trade_manager.did"
import {
  validateAndCalculateHoldings,
  filteredTradesByAssetPair,
  validateAndCalculateTotalSpent,
  calculateCostBasis
} from '../../lib/calcs'

interface PartialPositionCardProps {
  position: Partial<Position>
  trades: Trade[]
}

export const PositionCard: FC<PartialPositionCardProps> = (props) => {
  const { position, trades } = props
  const { assetPair } = position
  const [price] = useState<number | undefined>(0.001)
  const [fetching] = useState<boolean>(false)
  const optionModalRef = useRef<HTMLDialogElement>(null)
  const [costBasis, setCostBasis] = useState<number>(0)
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([])
  const [totalHeld, setTotalHeld] = useState<number>(0)
  const [totalSpent, setTotalSpent] = useState<number>(0)

  useEffect(() => {
    // Guard for missing AssetPair
    if (!assetPair) return

    // Guard for empty trades array
    if (trades.length < 1) return

    // Filter the trades based on their corresponding AssetPair
    setFilteredTrades(filteredTradesByAssetPair(trades, assetPair))

    // Guard for missing filtered trades
    if (filteredTrades.length < 1) return

    setTotalHeld(validateAndCalculateHoldings(filteredTrades).currentHoldings)
    setTotalSpent(validateAndCalculateTotalSpent(filteredTrades))

    if (!totalHeld || !totalSpent) return
    setCostBasis(calculateCostBasis(totalHeld, totalSpent))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const getTotalInvested = () => {
    const longTotal = trades
      .filter(trade => 'buy' in trade.tradeType)
      .reduce((acc, trade) => acc + trade.quoteAssetAmount, 0)

    const shortTotal = filteredTrades
      .filter(trade => 'sell' in trade.tradeType)
      .reduce((acc, trade) => acc + (trade.baseAssetAmount || 0), 0)

    return longTotal - shortTotal
  }

  const getAssetsHeld = () => {
    const longTotal = filteredTrades
      .filter(trade => 'buy' in trade.tradeType)
      .reduce((acc, trade) => acc + (trade.quoteAssetAmount || 0), 0)

    const shortTotal = filteredTrades
      .filter(trade => 'sell' in trade.tradeType)
      .reduce((acc, trade) => acc + (trade.baseAssetAmount || 0), 0)

    return longTotal - shortTotal
  }

  const calculateRoi = (currentValue: number) => {
    return costBasis !== 0 ? ((currentValue - costBasis) / costBasis * 100).toFixed(2) : '0.00'
  }

  const openOptionsModal = () => optionModalRef.current?.showModal()

  return (
    <Card className="w-full bg-gray-800 text-gray-100 shadow-lg rounded-2xl">
      <CardHeader className="border-b border-b-gray-700 pb-0 mb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 text-center">{position.assetPair?.base.symbol}/{position.assetPair?.quote.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between items-start">
          <div className="w-1/2 space-y-4 text-left">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Total {position.assetPair?.base.symbol} Held:</span>
              <span className="text-gray-300">
                {totalHeld.toLocaleString("en-US", { style: "decimal" })}
                {" "}${position.assetPair?.base.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Total {position.assetPair?.quote.symbol} Invested:</span>
              <span className="text-gray-300">
                {totalSpent.toLocaleString("en-US", { style: "decimal" })} ${position.assetPair?.quote.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Total Position Cost Basis:</span>
              <span className={price && costBasis < price ? "text-green-400" : "text-red-400"}>
                {costBasis.toLocaleString("en-US", { style: "decimal" })} ${position.assetPair?.quote.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current Value of {position.assetPair?.base.symbol}:</span>
              <span className="text-gray-300">
                {fetching ? "Getting Current Price" : price ?
                  `${price.toLocaleString("en-US", { style: "decimal" })} $${position.assetPair?.quote.symbol}` :
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
                  {Number(calculateRoi(price))}%
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
                  {(getAssetsHeld() * price).toLocaleString("en-US", { style: "decimal" })} ${position.assetPair?.quote.symbol}
                </span>
              ) : (
                <span className="text-gray-300">Position value not available</span>
              )}
            </div>
          </div>
          <div className="w-5/12 overflow-hidden">
            <div className="w-full h-full">
              <ROIBarChart roi={Number(calculateRoi(price || 0))} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={openOptionsModal} className="bg-gray-700 text-gray-200 hover:bg-gray-600">
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Options
          </Button>
          <Button variant="outline" size="sm" asChild className="bg-gray-700 text-gray-200 hover:bg-gray-600">
            <Link to={'/trades'}>
              <List className="h-4 w-4 mr-2" />
              Trades
            </Link>
          </Button>
        </div>
      </CardFooter>
      <OptionsModal modalRef={optionModalRef} />
    </Card>
  )
}