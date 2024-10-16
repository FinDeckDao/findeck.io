import { FC } from "react"
import { PositionCard } from "./Card"
import { Position } from '../../../../declarations/position_manager/position_manager.did'

interface PositionCardsProps {
  positions: Partial<Position>[]
}

export const PositionCards: FC<PositionCardsProps> = (props) => {
  const { positions } = props
  const count = positions.length

  const cleanPositions = positions.filter((position) => position !== null)

  return (
    <div className={
      `grid grid-cols-1 gap-4
      ${count >= 3 ? 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1' : null} 
      ${count === 2 ? 'lg:grid-cols-2' : null} 
      ${count === 1 ? 'lg:grid-cols-1' : null}`}
    >
      {
        cleanPositions.map((position, index) => (
          <PositionCard key={index} position={position} />
        ))
      }
    </div >
  )
}