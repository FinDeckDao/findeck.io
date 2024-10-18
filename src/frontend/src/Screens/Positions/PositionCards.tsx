import { FC } from "react"
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

  return (
    <div className={
      `grid grid-cols-1 gap-4
      ${count >= 3 ? 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1' : null} 
      ${count === 2 ? 'lg:grid-cols-2' : null} 
      ${count === 1 ? 'lg:grid-cols-1' : null}`}
    >
      {
        partialPositions.map((position, index) => (
          <PositionCard
            key={`${index}-${position.assetPair?.base.symbol}-${position.assetPair?.quote.symbol}`}
            position={position}
            trades={trades}
          />
        ))
      }
    </div >
  )
}