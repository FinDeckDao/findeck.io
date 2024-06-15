import { useContext, FC } from "react"
import { Trade } from "../../Contexts/Trade"
import { Md5 } from "ts-md5"
import { TradesContext } from "../../Contexts/Trade"
import { AssetPair } from "../../Contexts/AssetPair"

interface TradeTableProps {
  assetPair: AssetPair
}

// This component displays all trades for a given asset pair.
export const TradesTable: FC<TradeTableProps> = (props) => {
  const { base, quote } = props.assetPair
  const { trades, setTrades } = useContext(TradesContext)


  // Filter out any trades that are null.
  // TODO: This is a bit of tech debt. We should not have null trades.
  //       For now this works, fix the root of this when it's convenient.
  const cleanTrades = trades.filter((trade) => {
    return trade !== null
  })

  // Use the asset pair to filter the trades.
  const filteredTrades = cleanTrades.filter((trade) => {
    return trade.assetPair.base.symbol === base.symbol
      && trade.assetPair.quote.symbol === quote.symbol
  })

  // Guard for empty trades.
  if (filteredTrades.length === 0) {
    return <div className="text-center">No trades found for {base.symbol}/{quote.symbol}.</div>
  }

  const deleteTrade = (t: Trade) => {
    // Filter out the trade to delete.
    const updatedTrades = trades.filter((trade) => {
      return trade !== t
    })

    // Update the trades context.
    if (setTrades && updatedTrades) {
      setTrades([...updatedTrades])
    }
  }

  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">Amount Purchased</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Price Paid</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Trade Type</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Base</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Quote</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredTrades.map(
                (trade, index) => {
                  const key = Md5.hashStr(JSON.stringify(trade))
                  return (
                    <tr key={key} className={index % 2 === 0 ? 'bg-slate-800 text-left' : 'text-left'}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3">
                        {trade.amount}{" "}
                        ${trade.type === "buy" ? trade.assetPair.base.symbol : trade.assetPair.quote.symbol}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {trade.price}{" "}
                        ${trade.type === "buy" ? trade.assetPair.quote.symbol : trade.assetPair.base.symbol}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.type}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.assetPair.base.symbol}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.assetPair.quote.symbol}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button className='btn btn-primary bg-slate-800 btn-outline uppercase'
                          onClick={() => deleteTrade(trade)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                }
              )
            }
          </tbody>
        </table >
      </div>
    </div>
  )
}