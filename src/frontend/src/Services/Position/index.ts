import { signal } from '@preact/signals-react'
import { Position } from '../../Components/Position/index'
import { Asset } from '../../../fixtures/assets'

// This is a local service that stores the positions of the user.
// Positions are stored in local storage and can be updated by the user.
// When backup is enabled the positions are stored on the ICP network.

// Get the existing positions from local storage.
const positionsFromLocalStorage: Position[] = JSON.parse(
  localStorage.getItem('positions') || JSON.stringify([])
)

// Export the global state.
export const positions = signal<Position[]>(positionsFromLocalStorage)

// Store the position in local storage.
// TODO: Function should account for new or existing positions.
export const storePosition = (position: Position) => {
  // Get the existing positions.
  const existingPositions = positions.value

  // Add the new position to the existing positions.
  existingPositions.push(position)

  // Update the global state.
  positions.value = existingPositions

  // Update the local storage.
  localStorage.setItem('positions', JSON.stringify(existingPositions))
}

// Interface for the new position props.
export interface NewPositionProps {
  index: number
  owner: string
  positionBase: Asset
  positionQuote: Asset
  tradeBase: Asset
  tradeQuote: Asset
  amount: number
  spent: number
  date: string
}

// Factory function that creates a new position.
export const newPosition = (props: NewPositionProps): Position => {
  const {
    tradeBase,
    tradeQuote,
    positionBase,
    positionQuote,
    amount,
    spent,
    date,
    owner,
    index
  } = props

  return {
    owner: owner,
    base: positionBase,
    quote: positionQuote,
    trades: [
      {
        index: index,
        amount: Number(amount),
        price: Number(spent),
        // If the base and quote are reversed for this trade then it should be a sell.
        type: tradeBase !== positionBase ? 'sell' : 'buy',
        date: date,
        base: tradeBase,
        quote: tradeQuote
      }
    ]
  }
}
