import React, { useState, useEffect } from "react"
import { Position } from "../../Components/Position"

export const PositionContext = React.createContext<Position[]>([])
export const PositionUpdateContext = React.createContext<React.Dispatch<React.SetStateAction<Position[]>>>(() => { })

interface PositionProviderProps {
  children: React.ReactNode
}
// This component provides setters and getters for the Positions Context.
export const PositionProvider = (props: PositionProviderProps) => {
  const { children } = props

  // Default value is an empty array of Positions.
  const [positions, setPositions] = useState<Position[]>([])

  // Previously set positions are pulled from local storage.
  useEffect(() => {
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

    // Update the state of positions if there are any that exist previously.
    if (positionsFromLocalStorage.length > 0) {
      setPositions(filteredPositions)
    }
  }, [positions])

  return (
    <PositionContext.Provider value={positions}>
      <PositionUpdateContext.Provider value={setPositions}>
        {children}
      </PositionUpdateContext.Provider>
    </PositionContext.Provider>
  )

}