import { useContext } from 'react'
import { PositionContext, PositionUpdateContext } from '.'

export const usePositions = () => {
  return useContext(PositionContext)
}

export const usePositionUpdate = () => {
  return useContext(PositionUpdateContext)
}
