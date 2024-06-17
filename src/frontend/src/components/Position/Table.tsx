import { FC, useContext } from 'react'
import { PositionContext } from '../../Contexts/Position'

// Individual Position Card
export const PositionsTable: FC = () => {
  const { positions } = useContext(PositionContext)
  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-gray-300">
          <thead>
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">Pair</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-slate-800 text-left' : 'text-left'}>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{position.assetPair.base.symbol}/{position.assetPair.quote.symbol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}