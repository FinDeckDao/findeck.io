import { useEffect, useState } from "react"
import { GetPositionCards } from "./Card"
import { DisplayContext } from "../../Contexts/Display"
import { useContext } from "react"
import { PositionsTable } from "./Table"
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'
import { Position } from '../../../../declarations/position_manager/position_manager.did'
import { useTradeManagerQueryCall } from "../../Providers/TradeManager"

// Container for rows and columns of positions
export const Positions = () => {
  const { display } = useContext(DisplayContext)
  type PartialPosition = Partial<Position>
  const [positions, setPositions] = useState<PartialPosition[]>([])

  // Get the positions from the TradeManager contract.
  const { call: getUserTrades } = useTradeManagerQueryCall({
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
      const partialPositions: PartialPosition[] = Object.entries(tradesByAssetPair).map(([key, trades]) => {
        return {
          assetPair: trades[0].assetPair, // Use the asset pair from the first trade
          // price and priceDate are undefined initially
        }
      })

      setPositions(partialPositions)
    }
  }) as { call: () => void, data: Trade[], loading: boolean, error: Error }

  useEffect(() => {
    console.log('PositionsScreen: useEffect')
    getUserTrades()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  switch (display) {
    case "cards":
      return <GetPositionCards positions={positions} />
    case "table":
      return <PositionsTable />
    default:
      return <GetPositionCards positions={positions} />
  }
}

