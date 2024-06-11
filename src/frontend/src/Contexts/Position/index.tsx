import React, { useState, Dispatch } from "react"
import { Position } from "../../Components/Position"

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

interface PositionProviderProps {
  children: React.ReactNode
}
// This component provides setters and getters for the Positions Context.
export const PositionProvider = (props: PositionProviderProps) => {
  const { children } = props

  // Default value is an empty array of Positions.
  const [positions, setPositions] = useState<Position[]>(filteredPositions)

  return (
    <PositionContext.Provider value={{ positions, setPositions }}>
      {children}
    </PositionContext.Provider>
  )
}