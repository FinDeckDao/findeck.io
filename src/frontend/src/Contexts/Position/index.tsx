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