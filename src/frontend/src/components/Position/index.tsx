import { Icp, Usd, Velo, Asset } from "../../../fixtures/assets"
import { PositionCard } from "./Card"
// import { position } from "./signal"
import { TradeProps } from "../Trade"

export type Position = {
  base: Asset
  quote: Asset
  trades: TradeProps[]
}

// This data should be store in a database for paying customers
// but for free customers, we can store it in the frontend.
const positions: Position[] = [
  {
    base: Icp, quote: Usd, trades: [
      { index: 1, amount: 1, price: 100, type: "buy", date: '2024-05-01', base: Icp, quote: Usd },
      { index: 2, amount: 2, price: 200, type: "buy", date: '2024-05-02', base: Icp, quote: Usd },
      { index: 3, amount: 3, price: 300, type: "buy", date: '2024-05-03', base: Icp, quote: Usd },
      { index: 4, amount: 1, price: 400, type: "sell", date: '2024-05-04', base: Icp, quote: Usd }
    ]
  },
  {
    base: Velo, quote: Usd, trades: [
      { index: 1, amount: 25000, price: 0.01, type: "buy", date: '2024-05-01', base: Velo, quote: Usd },
      { index: 2, amount: 25000, price: 0.005, type: "buy", date: '2024-05-02', base: Velo, quote: Usd },
      { index: 3, amount: 25000, price: 0.004, type: "buy", date: '2024-05-03', base: Velo, quote: Usd },
      { index: 4, amount: 50000, price: 0.005, type: "sell", date: '2024-05-04', base: Velo, quote: Usd }
    ]
  },
]


const getCards = (positions: Position[]) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {
        positions.map((position, index) => (
          <PositionCard key={index} {...position} />
        ))
      }
    </div>
  )
}

interface PositionsProps {
  view?: "cards" | "table" | "list"
}

// Container for rows and columns of positions
export const Positions = (props: PositionsProps) => {
  const { view } = props

  switch (view) {
    case "cards":
      return getCards(positions)
    case "table":
      return <>Map of Table rows</>
    case "list":
      return <>List</>
    default:
      return getCards(positions)
  }
}

