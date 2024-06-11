import { Asset } from "../../../fixtures/assets"
import { GetCards } from "./Card"
// import { position } from "./signal"
import { TradeProps } from "../Trade"


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
  const { view } = props

  switch (view) {
    case "cards":
      return <GetCards />
    case "table":
      return <>Map of Table rows</>
    case "list":
      return <>List</>
    default:
      return <GetCards />
  }
}

