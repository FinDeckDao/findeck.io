import { FC, useState } from "react"
import { PositionCard } from "./PositionCard"
import { Position } from '../../../../declarations/position_manager/position_manager.did'
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'

interface PositionCardsProps {
  partialPositions: Partial<Position>[]
  trades: Trade[]
}

export const PositionCards: FC<PositionCardsProps> = (props) => {
  const { partialPositions, trades } = props
  const count = partialPositions.length

  const [searchTerm, setSearchTerm] = useState('')
  const filteredPositions = partialPositions.filter(position =>
    position.assetPair?.base.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.assetPair?.quote.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const sortedAndFilteredPositions = [...filteredPositions].sort((a, b) => {
    const symbolA = a.assetPair?.base.symbol.toLowerCase() || ''
    const symbolB = b.assetPair?.base.symbol.toLowerCase() || ''
    return sortOrder === 'asc'
      ? symbolA.localeCompare(symbolB)
      : symbolB.localeCompare(symbolA)
  })

  return (
    <div className={
      `grid grid-cols-1 gap-4
      ${count >= 3 ? 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1' : null} 
      ${count === 2 ? 'lg:grid-cols-2' : null} 
      ${count === 1 ? 'lg:grid-cols-1' : null}`}
    >
      <div className="col-span-full mb-4">
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by asset symbol..."
              className="w-full p-2 pl-10 border rounded-lg"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 whitespace-nowrap"
            >
              Sort {sortOrder === 'asc' ? '↓' : '↑'}
            </button>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {
        sortedAndFilteredPositions.map((position, index) => (
          <PositionCard
            key={`${index}-${position.assetPair?.base.symbol}-${position.assetPair?.quote.symbol}`}
            position={position}
            trades={trades}
          />
        ))
      }
    </div>
  )
}