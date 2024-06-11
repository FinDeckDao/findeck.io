import { Asset } from '../../../fixtures/assets'
import { Position } from '../../Components/Position'

// Interface for the new position props.
export interface NewPositionProps {
  owner: string
  positionBase: Asset
  positionQuote: Asset
  tradeBase: Asset
  tradeQuote: Asset
  amount: number
  spent: number
  date: string
}

// Derives the number of trades for a given base and quote.
// This is used to index the trades array.
const tradeCount = (
  positions: Position[],
  base: Asset,
  quote: Asset
): number => {
  return positions.reduce((acc: number, position: Position) => {
    return position.base.symbol === base.symbol &&
      position.quote.symbol === quote.symbol
      ? acc + 1
      : acc
  }, 0)
}

// Factory function that creates a new position.
export const constructPosition = (props: NewPositionProps): Position => {
  const {
    tradeBase,
    tradeQuote,
    positionBase,
    positionQuote,
    amount,
    spent,
    date,
    owner
  } = props

  return {
    owner: owner,
    base: positionBase,
    quote: positionQuote,
    trades: [
      {
        index: tradeCount([], tradeBase, tradeQuote),
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

export interface StorePositionsProps {
  positions: Position[]
  position: Position
}

// Takes positions and a new position then stores them in local storage.
// Returns the updated positions array.
export const updatePositions = (props: StorePositionsProps) => {
  const { positions, position } = props

  // Guard against null or undefined positions.
  if (!position || !positions) {
    throw new Error('Missing required inputs: position, positions, or setter.')
    return
  }

  // Find the position that matches the base and quote.
  const existingPosition: Position | undefined = positions.find(
    (existingPosition: Position) => {
      // Account for any null or undefined positions.
      // TODO: This is a temporary fix for a bug that causes null positions
      //       to be stored during the development.
      if (position)
        return (
          existingPosition.base.symbol === position.base.symbol &&
          existingPosition.quote.symbol === position.quote.symbol
        )
    }
  )

  // Case 1 - The position doesn't exist.
  // If the position doesn't exist just save it.
  if (!existingPosition) {
    positions.push(position)
    // Update the local storage to reflect the changes on subsequent page loads.
    saveToLocalStorage(positions)
    return positions
  }

  // Case 2 - The position exists.
  // If the position exists, update the trades array keying off of the based and quote.
  // Return the entire positions array with the updated position.

  // Construct a new trade object and push it to the existing position's trades array.
  existingPosition.trades.push({
    index: existingPosition.trades.length++,
    amount: Number(position.trades[0].amount),
    price: Number(position.trades[0].price),
    type: position.trades[0].type,
    date: position.trades[0].date,
    base: position.trades[0].base,
    quote: position.trades[0].quote
  })
  saveToLocalStorage(positions)
  return positions

  // TODO: Persist the positions to the ICP network's Stable Memory Persistence Store
  //       if the user is a paid subscriber.
  // saveToStableMemory(positions)
}

const saveToLocalStorage = (positions: Position[]) => {
  localStorage.setItem('positions', JSON.stringify(positions))
}

// TODO: Bind this function to the user's ICP identity and save it to the ICP network.
// const saveToStableMemory = (positions: Position[]) => { }
