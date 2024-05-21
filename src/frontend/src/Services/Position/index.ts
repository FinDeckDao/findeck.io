import { signal } from '@preact/signals-react'
import { Position } from '../../Components/Position/index'

// This is a local service that stores the positions of the user.
// Positions are stored in local storage and can be updated by the user.
// When backup is enabled the positions are stored on the ICP network.

// Get the existing positions from local storage.
const positionsFromLocalStorage: Position[] = JSON.parse(
  localStorage.getItem('positions') || JSON.stringify([])
)

// Export the global state.
export const positions = signal<Position[]>(positionsFromLocalStorage)

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
