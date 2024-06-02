import { Position } from '../../Components/Position'

interface StorePositionsProps {
  positions: Position[]
  setter: React.Dispatch<React.SetStateAction<Position[]>>
  position: Position
}

// Store the position in local storage.
// TODO: Function should account for new or existing positions.
export const storePosition = (props: StorePositionsProps) => {
  const { positions, position, setter } = props

  // Guard against null or undefined positions.
  if (position === null || position === undefined) {
    return
  }

  // Add the new position to the existing positions.
  positions.push(position)

  // Update the global state to reflect the changes immediately in the UI.
  setter(positions)

  // Update the local storage to reflect the changes on subsequent page loads.
  localStorage.setItem('positions', JSON.stringify(positions))

  // TODO: Persist the positions to the ICP network's Stable Memory Persistence Store
  //       if the user is a paid subscriber.
}
