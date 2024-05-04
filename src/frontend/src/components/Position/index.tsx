import { Icp, Usd, Velo, Asset } from "../../lib/assets"
import { PositionCard } from "./card"
// import { position } from "./signal"

export type Trade = {
  amount: number
  price: number
  type: "buy" | "sell"
}

export type Position = {
  base: Asset
  quote: Asset
  trades: Trade[]
}

// This data should be store in a database for paying customers
// but for free customers, we can store it in the frontend.
const positions: Position[] = [
  {
    base: Icp, quote: Usd, trades: [
      { amount: 1, price: 100, type: "buy" },
      { amount: 2, price: 200, type: "buy" },
      { amount: 3, price: 300, type: "buy" },
      { amount: 1, price: 400, type: "sell" }
    ]
  },
  {
    base: Velo, quote: Usd, trades: [
      { amount: 25000, price: 0.01, type: "buy" },
      { amount: 25000, price: 0.005, type: "buy" },
      { amount: 25000, price: 0.004, type: "buy" },
      { amount: 50000, price: 0.005, type: "sell" }
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

