import { FC } from 'react'
import { Trade, } from '../../../../declarations/trade_manager/trade_manager.did'
import { AssetPairComponent } from './AssetPair'
import { format } from 'date-fns'
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { DeleteGuard } from '@/Components/Modals/DeleteGuard'
import { useTradeManagerUpdateCall } from '../../Providers/TradeManager'
import { calculateCostBasis } from '@/lib/calcs'

export interface TradeInfoProps {
  trade: Trade,
  index: number,
  isDeleting: () => void
  isDeleted: () => void
}

export const TradeInfo: FC<TradeInfoProps> = (props) => {
  const { trade, index, isDeleted, isDeleting } = props

  const { call: deleteTrade } = useTradeManagerUpdateCall({
    functionName: "deleteTrade",
    onSuccess: () => { isDeleted() }
  })

  const handleDelete = () => {
    isDeleting()
    deleteTrade([BigInt(index)])
  }

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

  const formatCryptoAmount = (amount: number, decimalPlaces: number = 2) => {
    console.log('amount', amount)
    try {
      // Use Intl.NumberFormat for formatting
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })

      return formatter.format(amount)
    } catch (error) {
      console.error("Error formatting amount:", error)
      return 'Invalid Amount'
    }
  }

  return (
    <div className="flex flex-col p-2 mb-4 bg-dark rounded-2xl text-white border border-gray-700">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex-grow">
          <AssetPairComponent assetPair={trade.assetPair} />
        </div>
        <div className="flex items-center space-x-2">
          <PencilSquareIcon
            className="h-5 w-5 text-gray-400 hover:text-gray-200 cursor-pointer"
          />
          <DeleteGuard
            item={trade}
            onDelete={handleDelete}
            message="This action cannot be undone. This will permanently remove this asset
                from your trade records. If you want have this trade record again in the future,
                you will need to add it again."
          />
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="whitespace-nowrap bg-gray-700 p-2 rounded-lg">
            {formatDate(trade.tradeDateTime)}
          </span>
          <span className="whitespace-nowrap bg-gray-700 p-2 rounded-lg">
            Purchased: {formatCryptoAmount(trade.baseAssetAmount)} ${trade.assetPair.base.symbol}
          </span>
          <span className="whitespace-nowrap bg-gray-700 p-2 rounded-lg">
            Paid: {formatCryptoAmount(trade.quoteAssetAmount)} ${trade.assetPair.quote.symbol}
          </span>
          <span className="whitespace-nowrap bg-gray-700 p-2 rounded-lg">
            Cost Basis: {formatCryptoAmount(calculateCostBasis(trade.quoteAssetAmount, trade.baseAssetAmount), 4)}
            {" "}${trade.assetPair.quote.symbol}
          </span>
        </div>
      </div>
    </div>
  )
}
