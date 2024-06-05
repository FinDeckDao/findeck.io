import { Asset } from "../../../fixtures/assets"
import { GetCards } from "./Card"
// import { position } from "./signal"
import { TradeProps } from "../Trade"
// import { positions } from "../../../fixtures/trades"
import { usePositions } from "../../Contexts/Position/Hooks"

// TODO: Normalize this data.
//       base and quote are redundant because that data exists 
//       in every trade. For now this will do.
export interface Position {
  base: Asset
  quote: Asset
  owner: string
  trades: TradeProps[]
}

interface PositionsProps {
  view?: "cards" | "table" | "list"
}

// Container for rows and columns of positions
export const Positions = (props: PositionsProps) => {
  const positions = usePositions()
  const { view } = props

  const filteredPositions = positions.filter((position) => position !== null)

  switch (view) {
    case "cards":
      return <GetCards positions={filteredPositions} />
    case "table":
      return <>Map of Table rows</>
    case "list":
      return <>List</>
    default:
      return <GetCards positions={filteredPositions} />
  }
}

