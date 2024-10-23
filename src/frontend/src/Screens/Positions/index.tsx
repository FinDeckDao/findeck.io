import { useState, useEffect, FC } from 'react'
import { DisplayControl } from './DisplayControl'
import { PositionTabs } from './PositionTabs'
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'
import { useTradeManagerQueryCall } from "../../Providers/TradeManager"
import { PartialPosition } from './types'
import { Link } from 'react-router-dom'
import { TbFidgetSpinner } from "react-icons/tb"

export const PositionsScreen: FC = () => {
  const [partialPositions, setPartialPositions] = useState<PartialPosition[]>([])

  // Get the positions from the TradeManager contract.
  // At this point the positions may be incomplete.
  // Example: If they don't have a price.
  const { call: getUserTrades, data, loading } = useTradeManagerQueryCall({
    functionName: "getUserTrades",
    onSuccess: (data) => {
      if (!data) return

      // Group trades by asset pair
      const tradesByAssetPair = data.reduce((acc, trade) => {
        const key = `${trade.assetPair.base.symbol}/${trade.assetPair.quote.symbol}`
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(trade)
        return acc
      }, {} as Record<string, Trade[]>)

      // Create partial positions from grouped trades
      const partialPositions: PartialPosition[] = Object.entries(tradesByAssetPair).map(([_key, trades]) => {
        return {
          assetPair: trades[0].assetPair, // Use the asset pair from the first trade
          // price and priceDate are undefined initially
        }
      })

      setPartialPositions(partialPositions)
    }
  })

  useEffect(() => {
    getUserTrades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-center mb-8 mt-4">Loading your positions</h1>
        <span className="flex items-center justify-center gap-2">
          Loading your trade data...
          <TbFidgetSpinner className="h-5 w-5 animate-spin" />
        </span>
      </div>
    )
  }

  if (data && data.length < 1) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-center mb-8 mt-4">No Positions Were Found</h1>
        <p>
          In order to review your positions please enter a trade on the{" "}
          <Link to="/trades" className="fdLink">Trade Screen</Link>.
        </p>
      </div>
    )
  }

  return (
    <PositionTabs partialPositions={partialPositions}>
      <DisplayControl partialPositions={partialPositions} trades={data as Trade[]} />
    </PositionTabs>
  )
}