import { FC, useState, useEffect } from 'react'
import { Button } from '@/Components/ui/button'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { CreateTradeModal } from './CreateTradeModal'
import { useTradeManagerQueryCall } from '@/Providers/tradeManager'
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'
import { AssetPairComponent } from './AssetPair'

export const TradesScreen: FC = () => {
  const [openClosed, toggleOpenClosed] = useState(false)

  const handleOpenModal = () => {
    toggleOpenClosed(true)
  }

  const { call, data, loading, error } = useTradeManagerQueryCall({
    functionName: "getUserTrades",
  }) as { call: () => void, data: Trade[], loading: boolean, error: Error }

  useEffect(() => {
    // If toggleOpenClosed is false then update the user's trades.
    if (!openClosed) {
      console.log("checkingUserTrades")
      call()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openClosed])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto min-h-96 p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Trades</h1>

      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          Create New Trade Record
        </Button>
      </div>

      <CreateTradeModal openClose={openClosed} toggleOpenClose={toggleOpenClosed} />
      {loading
        ? <div>Loading...</div>
        : null
      }
      {data && (data.map((trade, index) => (
        <div
          key={`${index}-${trade.assetPair.base.symbol}/${trade.assetPair.quote.symbol}`}
          className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded-2xl text-white 
                     border border-gray-700"
        >
          <AssetPairComponent assetPair={trade.assetPair} />
        </div>
      )))}
    </div>
  )
}

export default TradesScreen