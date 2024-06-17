import { FC, useContext } from 'react'
import { PositionContext } from '../../Contexts/Position'
import { getAssetsHeld, getCostBasis, getValueAtRisk } from './helpers'
import { TradesContext } from '../../Contexts/Trade'

// Individual Position Card
export const PositionsTable: FC = () => {
  const { positions } = useContext(PositionContext)
  const { trades } = useContext(TradesContext)

  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-gray-300">
          <thead>
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">
                Pair
              </th>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">
                Holdings
              </th>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">
                Value At Risk
              </th>
              <td className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">
                Cost Basis
              </td>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => {
              const assetsHeld = getAssetsHeld(trades, position.assetPair)
              const valueAtRisk = getValueAtRisk(trades, position.assetPair)
              return (
                <tr key={index} className={index % 2 === 0 ? 'bg-slate-800 text-left' : 'text-left'}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {position.assetPair.base.symbol}/{position.assetPair.quote.symbol}
                  </td>
                  <td>
                    {assetsHeld.toLocaleString("en-US", { style: "decimal" })}{" "}
                    ${position.assetPair.base.symbol}
                  </td>
                  <td>{valueAtRisk} ${position.assetPair.quote.symbol}</td>
                  <td>{getCostBasis(valueAtRisk, assetsHeld).toLocaleString("en-US", { style: "decimal" })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}