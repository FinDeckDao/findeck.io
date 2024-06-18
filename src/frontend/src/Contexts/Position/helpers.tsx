import { Dispatch, SetStateAction } from 'react'
import { Position } from './'
import { Trade } from '../Trade'

interface DeletePositionProps {
  positions: Position[],
  position: Position,
  setter: Dispatch<SetStateAction<Position[]>> | null
  trades: Trade[],
  tradeSetter: Dispatch<SetStateAction<Trade[]>> | null
}
// Handles the details related to the removal of a Position.
export const deletePosition = (props: DeletePositionProps) => {
  const { position, positions, setter } = props
  // Filter out the trade to delete.
  const updatedPosition = positions.filter((p) => {
    return p !== position
  })

  // Update the trades context.
  if (setter && updatedPosition) {
    setter([...updatedPosition])
  }

  // Update the local storage.
  localStorage.setItem('positions', JSON.stringify(updatedPosition))

  // Filter out the trades for the position to delete.
  const updatedTrades = props.trades.filter((trade) => {
    return trade.assetPair.base.symbol !== position.assetPair.base.symbol
      && trade.assetPair.quote.symbol !== position.assetPair.quote.symbol
  })

  // Update the trade context.
  if (props.tradeSetter && updatedTrades) {
    props.tradeSetter([...updatedTrades])
  }

  // Update the local storage.
  localStorage.setItem('trades', JSON.stringify(updatedTrades))

  // TODO: For paid customers, add an additional layer to store this data on the ICP network.
}