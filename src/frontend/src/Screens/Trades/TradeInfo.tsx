import { FC } from 'react'
import { Trade, } from '../../../../declarations/trade_manager/trade_manager.did'
import { AssetPairComponent } from './AssetPair'
import { format } from 'date-fns'

export interface TradeInfoProps {
  trade: Trade
}

export const TradeInfo: FC<TradeInfoProps> = (props) => {
  const { trade } = props

  const formatDate = (dateValue: bigint) => {
    try {
      // Convert nanoseconds to milliseconds
      const milliseconds = Number(dateValue / BigInt(1000000))

      const date = new Date(milliseconds)

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }

      return format(date, 'PPP')
    } catch (error) {
      console.error("Error formatting date:", error)
      return 'Invalid Date'
    }
  }

  const formatCryptoAmount = (amount: bigint, decimalPlaces: number = 2) => {
    try {
      // Convert BigInt to a number, dividing by 1e18
      const value = Number(amount) / 1e18

      // Use Intl.NumberFormat for formatting
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })

      return formatter.format(value)
    } catch (error) {
      console.error("Error formatting amount:", error)
      return 'Invalid Amount'
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between p-2 mb-4 bg-gray-800 rounded-2xl text-white border border-gray-700">
      <div className="sm:mb-0 md:mb-4 lg:mb-0 xl:mb-0 2xl:mb-0">
        <AssetPairComponent assetPair={trade.assetPair} />
      </div>
      <div className="flex flex-col md:flex-row items-start md:space-x-4 mt-6 md:mt-0 space-y-4 md:space-y-0 w-full md:w-auto border-t md:border-t-0 border-gray-700 pt-4 md:pt-0">
        <span className="whitespace-nowrap bg-gray-700 p-2 rounded-lg">
          {formatDate(trade.dateOfTrade)}
        </span>
        <span className="whitespace-nowrap bg-gray-700 p-2 rounded-lg">
          Purchased: {formatCryptoAmount(trade.baseAssetAmount)} ${trade.assetPair.base.symbol}
        </span>
        <span className="whitespace-nowrap bg-gray-700 p-2 rounded-lg">
          Paid: {formatCryptoAmount(trade.quoteAssetAmount)} ${trade.assetPair.quote.symbol}
        </span>
      </div>
    </div>
  )
}
