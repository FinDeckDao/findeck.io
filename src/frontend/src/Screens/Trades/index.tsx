import { FC, useState, useEffect, useMemo } from 'react'
import { Button } from '@/Components/ui/button'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { CreateTradeModal } from './CreateTradeModal'
import { useTradeManagerQueryCall } from '@/Providers/tradeManager'
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'
import { TradeInfo } from './TradeInfo'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TbFidgetSpinner } from "react-icons/tb"

export const TradesScreen: FC = () => {
  const [openClosed, toggleOpenClosed] = useState(false)
  const [selectedPair, setSelectedPair] = useState<string>('all')
  const [deleting, setDeleting] = useState<boolean>(false)

  const handleOpenModal = () => {
    toggleOpenClosed(true)
  }

  const { call: getUserTrades, data, loading, error } = useTradeManagerQueryCall({
    functionName: "getUserTrades",
    onSuccess: (data: Trade[]) => {
      console.log('getUserTrades success')
      console.log(data)
    }
  }) as { call: () => void, data: Trade[], loading: boolean, error: Error }

  useEffect(() => {
    if (!openClosed) {
      getUserTrades()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openClosed])

  const uniquePairs = useMemo(() => {
    if (!data) return []
    const pairs = data.map(trade => `${trade.assetPair.base.symbol}/${trade.assetPair.quote.symbol}`)
    return Array.from(new Set(pairs))
  }, [data])

  const filteredTrades = useMemo(() => {
    if (!data) return []
    if (selectedPair === 'all') return data
    return data.filter(trade =>
      `${trade.assetPair.base.symbol}/${trade.assetPair.quote.symbol}` === selectedPair
    )
  }, [data, selectedPair])

  const handlePairChange = (value: string) => {
    setSelectedPair(value)
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto min-h-96 p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Trades</h1>
      <div className="flex justify-between items-center mb-6">
        {data && data.length > 0
          ? (
            <Select onValueChange={handlePairChange} value={selectedPair}>
              <SelectTrigger className="w-[200px] bg-dark text-white">
                <SelectValue placeholder="Filter by pair" />
              </SelectTrigger>
              <SelectContent className="bg-dark text-white">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-gray-700 focus:bg-gray-700 hover:text-white focus:text-white">
                  All Pairs
                </SelectItem>
                {uniquePairs.map(pair => (
                  <SelectItem key={pair} value={pair}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700 hover:text-white focus:text-white">
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
          : <div>{" "}</div>}

        <Button
          variant="outline"
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white w-auto dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          Create New Trade Record
        </Button>
      </div>

      <CreateTradeModal openClose={openClosed} toggleOpenClose={toggleOpenClosed} />
      {loading ? <div className="inline-flex">Loading... <TbFidgetSpinner className="h-5 w-5 animate-spin" /></div> : null}
      {deleting ? <div className="inline-flex">Deleting... <TbFidgetSpinner className="h-5 w-5 animate-spin" /></div> : null}

      {filteredTrades.map((trade, index) => (
        <TradeInfo
          index={index}
          trade={trade}
          key={`${index}-${trade.assetPair.base.symbol}/${trade.assetPair.quote.symbol}`}
          isDeleting={() => {
            setDeleting(true)
          }}
          isDeleted={() => {
            setDeleting(false)
            getUserTrades()
          }}
        />
      ))}
    </div>
  )
}

export default TradesScreen