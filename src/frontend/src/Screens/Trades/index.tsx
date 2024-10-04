import { FC, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { CreateTradeModal } from './CreateTradeModal'
import { useQueryCall } from '@ic-reactor/react'
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'

export const TradesScreen: FC = () => {
  const [openClosed, toggleOpenClosed] = useState(false)

  const handleOpenModal = () => {
    toggleOpenClosed(true)
  }

  const { data, loading, error } = useQueryCall({
    functionName: "getUserTrades",
  }) as { data: Trade[], loading: boolean, error: Error }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto min-h-96 p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Trades</h1>

      <div className="flex justify-end mb-6">
        <Button
          onClick={handleOpenModal}
          className="bg-blue-400 hover:bg-blue-500 text-white w-full sm:w-auto"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          Trade
        </Button>
      </div>

      <CreateTradeModal openClose={openClosed} toggleOpenClose={toggleOpenClosed} />
      {loading
        ? <div>Loading...</div>
        : null
      }
      {data
        ? data.length
        : null
      }
    </div>
  )
}

export default TradesScreen