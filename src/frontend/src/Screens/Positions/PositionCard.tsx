import { useRef, useState, FC, useEffect, useMemo, memo } from "react"
import { Link } from 'react-router-dom'
import { OptionsModal } from "../../Components/Position/OptionsModal"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, List } from "lucide-react"
import { Position } from '../../../../declarations/position_manager/position_manager.did'
import { ROIBarChart } from '../../Components/Charts/RoiBarChart'
import { Trade } from "../../../../declarations/trade_manager/trade_manager.did"
import {
  calculateCostBasis,
  calculateTotalPositionValue,
  filteredTradesByAssetPair,
  validateAndCalculateHoldings,
  validateAndCalculateTotalSpent,
} from '../../lib/calcs'
import { usePriceProxyQueryCall } from '@/Providers/PriceProxy'
import { LoaderWithExplanation } from "@/Components/Loaders"
import { AssetPair } from "../../../../declarations/price_proxy/price_proxy.did"
import { AssetPairComponent } from "@/Components/Assets/AssetPair"

interface PartialPositionCardProps {
  position: Partial<Position>
  trades: Trade[]
}

const MemoizedROIBarChart = memo(({ roi }: { roi: number }) => (
  <ROIBarChart roi={roi} />
))

// Helper function to generate cache key
const getCacheKey = (assetPair: AssetPair) =>
  `price_${assetPair.base.symbol}_${assetPair.quote.symbol}`.toLowerCase()

const useCachedPrice = (assetPair: AssetPair | null) => {
  const [price, setPrice] = useState<number | undefined>(undefined)
  const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour in milliseconds

  // Try to get initial price from cache
  useEffect(() => {
    if (!assetPair) return

    try {
      const cacheKey = getCacheKey(assetPair)
      const cachedDataString = localStorage.getItem(cacheKey)
      if (cachedDataString) {
        const cachedData = JSON.parse(cachedDataString)
        const now = Date.now()

        if (now - cachedData.lastFetched < CACHE_DURATION_MS) {
          console.log('Initially using cached price for', assetPair.base.symbol, '/', assetPair.quote.symbol)
          setPrice(cachedData.price)
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error)
    }
  }, [assetPair, CACHE_DURATION_MS])

  const updatePrice = (newPrice: number | undefined) => {
    if (!assetPair || newPrice === undefined) {
      setPrice(undefined)
      return
    }

    const priceData = {
      price: newPrice,
      lastFetched: Date.now()
    }
    setPrice(newPrice)
    const cacheKey = getCacheKey(assetPair)
    localStorage.setItem(cacheKey, JSON.stringify(priceData))
  }

  return { price, setPrice: updatePrice }
}

export const PositionCard: FC<PartialPositionCardProps> = (props) => {
  const { position, trades } = props
  const { assetPair } = position
  const optionModalRef = useRef<HTMLDialogElement>(null)

  // Memoize the formatted asset pair
  const formattedAssetPair = useMemo((): AssetPair | null => {
    if (!assetPair?.base?.symbol) return null
    return {
      base: {
        img_url: assetPair.base.img_url,
        name: assetPair.base.name,
        slug: assetPair.base.slug,
        symbol: assetPair.base.symbol,
        variant: assetPair.base.variant
      },
      quote: {
        img_url: assetPair.quote.img_url,
        name: assetPair.quote.name,
        slug: assetPair.quote.slug,
        symbol: assetPair.quote.symbol,
        variant: assetPair.quote.variant
      }
    } as AssetPair
  }, [assetPair])

  // Memoize filtered trades
  const filteredTrades = useMemo(() => {
    if (!trades.length || !assetPair) return []
    return filteredTradesByAssetPair(trades, assetPair)
  }, [trades, assetPair])

  // Memoize trade calculations
  const { totalHeld, totalSpent, costBasis } = useMemo(() => {
    if (!filteredTrades.length) {
      return { totalHeld: 0, totalSpent: 0, costBasis: 0 }
    }

    const held = validateAndCalculateHoldings(filteredTrades).currentHoldings
    const spent = validateAndCalculateTotalSpent(filteredTrades)
    const basis = calculateCostBasis(held, spent)

    return {
      totalHeld: held,
      totalSpent: spent,
      costBasis: basis
    }
  }, [filteredTrades])

  // Use the new hook for price management
  const { price, setPrice } = useCachedPrice(formattedAssetPair)

  // Price fetching logic
  const { call, loading } = usePriceProxyQueryCall({
    functionName: "getExchangeRate",
    onSuccess: (data) => {
      if (Array.isArray(data) && data[0] && 'price' in data[0]) {
        console.log('Price fetched:', data[0])
        setPrice(Number(data[0].price))
      }
    },
    onError: (error) => {
      console.error('Price fetch error:', error)
      setPrice(undefined)
    }
  })

  // Only fetch price when we have valid data and no price is set
  useEffect(() => {
    if (!formattedAssetPair || !filteredTrades.length || price !== undefined) return

    try {
      call([formattedAssetPair])
    } catch (error) {
      console.error('Error calling price proxy:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedAssetPair, filteredTrades.length, price])

  // Memoize position value and ROI calculations
  const currentPositionValue = useMemo(() => {
    if (!price || !totalHeld) return 0
    return calculateTotalPositionValue(totalHeld, price)
  }, [price, totalHeld])

  const roi = useMemo(() => {
    if (!price || !costBasis) return 0
    return ((price - costBasis) / costBasis * 100)
  }, [price, costBasis])

  const openOptionsModal = () => optionModalRef.current?.showModal()

  // Early return if we don't have basic required data
  if (!assetPair?.base?.symbol || !filteredTrades.length) {
    return null
  }

  return (
    <Card className="w-full bg-dark text-white shadow-lg rounded-2xl">
      <CardHeader className="border-b border-b-gray-700 pb-0 mb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 flex justify-center items-center">
          <AssetPairComponent assetPair={assetPair} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between items-start">
          <div className="w-1/2 space-y-4 text-left">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">
                Total {assetPair.base.symbol} Held:
              </span>
              <span className="text-gray-300">
                {totalHeld.toLocaleString("en-US", { style: "decimal" })}
                {" "}${assetPair.base.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Total Position Cost Basis:</span>
              <span className={price && costBasis < price ? "text-green-400" : "text-red-400"}>
                {costBasis.toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current Value of {assetPair.base.symbol}:</span>
              <span className="text-gray-300">
                {
                  (loading || !price)
                    ? <LoaderWithExplanation explanation="Getting Price..." align="left" />
                    : `${price.toLocaleString("en-US", { style: "decimal" })} $${assetPair.quote.symbol}`
                }
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current ROI:</span>
              {loading ? (
                <span className="text-gray-300">Waiting on Current Price</span>
              ) : price ? (
                <span className={`${roi > 0 ? "text-green-400" : "text-red-400"}`}>
                  {roi.toFixed(2)}%
                </span>
              ) : (
                <span className="text-gray-300">Getting price to calculate ROI</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">
                Total {assetPair.quote.symbol} Invested:
              </span>
              <span className="text-gray-300">
                {totalSpent.toLocaleString("en-US", { style: "decimal" })}{" "}
                ${assetPair.quote.symbol}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">Current Position Value:</span>
              {loading ? (
                <span className="text-gray-300">Waiting on Current Price</span>
              ) : price ? (
                <span className={totalSpent < currentPositionValue ? "text-green-400" : "text-red-400"}>
                  {currentPositionValue.toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
                </span>
              ) : (
                <span className="text-gray-300">Position value not available</span>
              )}
            </div>
          </div>
          <div className="w-5/12 overflow-hidden">
            <div className="w-full h-full">
              <MemoizedROIBarChart roi={roi} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openOptionsModal}
            className="bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Options
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
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