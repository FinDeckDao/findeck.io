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
  setter: React.Dispatch<React.SetStateAction<Position[]>>
  position: Position
}

// Store the position in local storage and to the global context.
// TODO: Function should account for new or existing positions.
export const storePosition = (props: StorePositionsProps) => {
  const { positions, position, setter } = props

  // Guard against null or undefined positions.
  if (!position) {
    console.error('Position is null or undefined.')
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

  // If the position doesn't exist just save it.
  if (!existingPosition) {
    positions.push(position)
  } else {
    // If the position exists, update the trades array keying off of the based and quote.
    existingPosition.trades.push({
      index: existingPosition.trades.length++,
      amount: Number(position.trades[0].amount),
      price: Number(position.trades[0].price),
      type: position.trades[0].type,
      date: position.trades[0].date,
      base: position.trades[0].base,
      quote: position.trades[0].quote
    })
    // Add the new position to the existing positions.
    positions.push(position)
  }

  // Update the local storage to reflect the changes on subsequent page loads.
  localStorage.setItem('positions', JSON.stringify(positions))
  console.log('Position stored in local storage:', position)

  // Update the global state to reflect the changes immediately in the UI.
  setter(positions)
  console.log('Position stored in global context:', position)

  // TODO: Persist the positions to the ICP network's Stable Memory Persistence Store
  //       if the user is a paid subscriber.
}
