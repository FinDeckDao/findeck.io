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
  calculateCostBasis,
  calculateTotalPositionValue,
  filteredTradesByAssetPair,
  validateAndCalculateHoldings,
  validateAndCalculateTotalSpent,
} from '../../lib/calcs'
import { usePriceProxyQueryCall } from '@/Providers/PriceProxy'
import { TbFidgetSpinner } from "react-icons/tb"

interface PartialPositionCardProps {
  position: Partial<Position>
  trades: Trade[]
}

export const PositionCard: FC<PartialPositionCardProps> = (props) => {
  const { position, trades } = props
  const { assetPair } = position

  // This price should be fetch from the XRC or gathered from the user.
  const [price, setPrice] = useState<number | undefined>(0)

  // Fetch the price of the selected
  const { call, error, loading } = usePriceProxyQueryCall({
    functionName: "get_exchange_rate",
    onSuccess: (data) => {
      if (data && "price" in data) {
        setPrice(Number(data.price))
      }
    }
  })

  if (error) {
    console.log(error)
    alert(`There was an error.`)
  }

  const optionModalRef = useRef<HTMLDialogElement>(null)
  const [costBasis, setCostBasis] = useState<number>(0)
  const [_filteredTrades, setFilteredTrades] = useState<Trade[]>([])
  const [totalHeld, setTotalHeld] = useState<number>(0)
  const [totalSpent, setTotalSpent] = useState<number>(0)
  const [currentPositionValue, setCurrentPositionValue] = useState<number>(0)

  useEffect(() => {
    // Guard for missing AssetPair
    if (!assetPair) return

    // Guard for empty trades array
    if (trades.length < 1) return

    if (!price) return

    // Filter the trades based on their corresponding AssetPair
    const filteredTrades = filteredTradesByAssetPair(trades, assetPair)
    setFilteredTrades(filteredTrades) // Set for subsequent renders.

    // Guard for missing filtered trades
    if (filteredTrades.length < 1) return

    const totalHeld = validateAndCalculateHoldings(filteredTrades).currentHoldings
    setTotalHeld(totalHeld) // Set for subsequent renders.

    const totalSpent = validateAndCalculateTotalSpent(filteredTrades)
    setTotalSpent(totalSpent) // Set for subsequent renders.

    if (!totalHeld || !totalSpent) return

    const costBasis = calculateCostBasis(totalHeld, totalSpent)
    setCostBasis(costBasis) // Set for subsequent renders.

    const currentPositionValue = calculateTotalPositionValue(totalHeld, price)
    setCurrentPositionValue(currentPositionValue) // Set for subsequent renders.

    if (assetPair.base && assetPair.quote) {
      call([assetPair.base.symbol, assetPair.quote.symbol])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calculateRoi = (currentValue: number) => {
    return costBasis !== 0 ? ((currentValue - costBasis) / costBasis * 100).toFixed(2) : '0.00'
  }

  const openOptionsModal = () => optionModalRef.current?.showModal()

  return (
    <Card className="w-full bg-dark text-white shadow-lg rounded-2xl">
      <CardHeader className="border-b border-b-gray-700 pb-0 mb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 text-center">{position.assetPair?.base.symbol}/{position.assetPair?.quote.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between items-start">
          <div className="w-1/2 space-y-4 text-left">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">
                Total {position.assetPair?.base.symbol} Held:
              </span>
              <span className="text-gray-300">
                {totalHeld.toLocaleString("en-US", { style: "decimal" })}
                {" "}${position.assetPair?.base.symbol}
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
                {loading
                  ? (
                    <div>"Getting Current Price"...{" "}
                      <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" /></div>
                  ) : (
                    price
                      ? `${price.toLocaleString("en-US", { style: "decimal" })} $${position.assetPair?.quote.symbol}`
                      : "Price not available"
                  )
                }
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current ROI:</span>
              {loading ? (
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
              <span className="font-semibold text-gray-100">
                Total {position.assetPair?.quote.symbol} Invested:
              </span>
              <span className="text-gray-300">
                {totalSpent.toLocaleString("en-US", { style: "decimal" })}{" "}
                ${position.assetPair?.quote.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current Position Value:</span>
              {loading ? (
                <span className="text-gray-300">Waiting on Current Price</span>
              ) : price ? (
                <span className={totalSpent < currentPositionValue ? "text-green-400" : "text-red-400"}>
                  {currentPositionValue.toLocaleString("en-US", { style: "decimal" })} ${position.assetPair?.quote.symbol}
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