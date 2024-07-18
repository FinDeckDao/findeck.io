import React, { useState, Dispatch, FC, PropsWithChildren } from "react"
import { AssetPair } from "../../Contexts/AssetPair"

// TODO: Normalize this data.
//       base and quote are redundant because that data exists 
//       in every trade. For now this will do.
export interface Position {
  assetPair: AssetPair
  owner: string
  price: number
  priceDate: string
}

// Define the context type for the Position Context.
interface PositionContextType {
  positions: Position[]
  setPositions: Dispatch<React.SetStateAction<Position[]>> | null
}

// Define the default context for the Position Context.
// If positions exist in local storage then load them here.
// Get the existing positions from local storage.
const positionsFromLocalStorage: Position[] = JSON.parse(
  localStorage.getItem('positions') || JSON.stringify([])
)

// If there are positions from local storage determine how old the price data is.
// If there are prices that are older than 1 hours then fetch new prices.
if (positionsFromLocalStorage.length > 0) {

  // Get the current time in milliseconds
  const now = new Date().getTime()
  // 60 minutes * 60 seconds * 1000 milliseconds
  const maxPriceLag = 60 * 60 * 1000

  // Iterate over the positions and check the price date.
  positionsFromLocalStorage.forEach((position) => {
    // If the position has an existing price date then check the time and compare it to the current time.
    if (position.priceDate) {
      const priceDate = new Date(position.priceDate).getTime()
      if (now - priceDate > maxPriceLag || !position.price) {
        // TODO: Fetches the new price data from the backend canister.
        // For Development just generate a random price.
        // TODO: Dry this up.
        position.priceDate = new Date().toISOString()
        const newPrice = Math.random() * 100
        position.price = newPrice
      }
    } else {
      // TODO: Fetches the new price data from the backend canister.
      // For Development just generate a random price.
      // TODO: Dry this up.
      position.priceDate = new Date().toISOString()
      const newPrice = Math.random() * 100
      position.price = newPrice
    }
  })
}

// Write any changes back to local storage.
localStorage.setItem('positions', JSON.stringify(positionsFromLocalStorage))

// TODO: This local cache may need to be replaced by a state pulled 
//       from the ICP network's Stable Memory Persistence Store.
//       Stable Memory supersedes local storage but there is a charge.

// Remove any null or undefined positions.
// TODO: This is a temporary fix for a bug that causes null positions
//       to be stored during the development.
const filteredPositions = positionsFromLocalStorage.filter(
  (position) => position !== null && position !== undefined
)

const defaultContext: PositionContextType = {
  positions: filteredPositions,
  setPositions: null
}

export const PositionContext = React.createContext<PositionContextType>(defaultContext)

// This component provides setters and getters for the Positions Context.
export const PositionProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props

  // Default value is an empty array of Positions.
  const [positions, setPositions] = useState<Position[]>(filteredPositions)

  return (
    <PositionContext.Provider value={{ positions, setPositions }}>
      {children}
    </PositionContext.Provider>
  )
}