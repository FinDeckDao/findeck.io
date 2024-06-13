import { FC, useContext } from 'react'
import { Trade } from '../../Components/Trade'
import { PositionContext } from '../../Contexts/Position'

export const Trades: FC = () => {
  const { positions } = useContext(PositionContext)
  const filteredPositions = positions.filter((position) => {
    return position.base.symbol === "ICP" && position.quote.symbol === "USD"
  })

  // Remove null values.
  const trades = filteredPositions[0].trades.filter((trade) => {
    return trade !== null
  })

  const updateTrade = (trade: Trade) => {
    console.log('Updating position:', trade)
  }

  const deleteTrade = (trade: Trade) => {
    console.log('Deleting position:', trade)
  }

  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">Amount</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Price</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Type</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Base</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Quote</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={trade.index} className={index % 2 === 0 ? 'bg-slate-800' : ''}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3">{trade.amount}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.price}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.type}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.date}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.base.symbol}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.quote.symbol}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <button className='btn btn-primary bg-slate-800 mr-2 btn-outline uppercase py-0 h-8'
                    onClick={() => updateTrade(trade)}>
                    Update
                  </button>
                  <button className='btn btn-primary bg-slate-800 btn-outline uppercase'
                    onClick={() => deleteTrade(trade)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table >
      </div>
    </div>
  )
}

export default Trades