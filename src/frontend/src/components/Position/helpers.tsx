import { Trade } from "../../Contexts/Trade"
import { AssetPair } from "../../Contexts/AssetPair"

// Remove all null values form the array.
export const removeNulls = (positions: Trade[]) => {
  return positions.filter((position) => position !== null)
}

// Get the total holdings of all trades.
export const getAssetsHeld = (trades: Trade[], assetPair: AssetPair) => {

  const cleanTrades = removeNulls(trades)
  const filteredTrades = getTradesForPosition(cleanTrades, assetPair)

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

  // Return the total holdings of the position.
  return longTotal - shortTotal
}

export const getValueAtRisk = (trades: Trade[], assetPair: AssetPair) => {

  const cleanTrades = removeNulls(trades)
  const filteredTrades = getTradesForPosition(cleanTrades, assetPair)

  // Get the value of all long trades.
  const longTrades = filteredTrades.filter((trade) => {
    return trade.type === "buy"
  })

  // Get the totals value of all long trades.
  const longTotal = longTrades.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.price
  }, 0)

  // Get the value of all short trades.
  const shortTrades = filteredTrades.filter((trade) => {
    return trade.type === "sell"
  })

  // Get the totals value of all short trades.
  const shortTotal = shortTrades.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.price
  }, 0)

  // Return the total value of the position.
  return longTotal - shortTotal
}

export const getTradesForPosition = (trades: Trade[], assetPair: AssetPair) => {
  return trades.filter((trade) => {
    return trade.assetPair.base.symbol === assetPair.base.symbol
      && trade.assetPair.quote.symbol === assetPair.quote.symbol
  })
}

export const getCostBasis = (invested: number, held: number) => {
  return invested / held
}