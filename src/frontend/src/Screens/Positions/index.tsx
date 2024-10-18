import { useState, useEffect, FC } from 'react'
import { DisplayControl } from './DisplayControl'
import { PositionTabs } from './PositionTabs'
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'
import { useTradeManagerQueryCall } from "../../Providers/TradeManager"
import { PartialPosition } from './types'

export const PositionsScreen: FC = () => {
  const [partialPositions, setPartialPositions] = useState<PartialPosition[]>([])

  // Get the positions from the TradeManager contract.
  // At this point the positions may be incomplete.
  // Example: If they don't have a price.
  const { call: getUserTrades, data: tradeData } = useTradeManagerQueryCall({
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
  }) as { call: () => void, data: Trade[], loading: boolean, error: Error }

  useEffect(() => {
    getUserTrades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PositionTabs partialPositions={partialPositions}>
      <DisplayControl partialPositions={partialPositions} trades={tradeData} />
    </PositionTabs>
  )
}