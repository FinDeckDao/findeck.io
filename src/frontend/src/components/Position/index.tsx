import { Icp, Usd, Velo, Asset } from "../../lib/assets"
import { signal } from "@preact/signals-react"

type Trade = {
  amount: number
  price: number
  type: "buy" | "sell"
}

type Position = {
  base: Asset
  quote: Asset
  trades: Trade[]
}

export const position = signal<Position | null>(null)

// This data should be store in a database for paying customers
// but for free customers, we can store it in the frontend.
const positions: Position[] = [
  {
    base: Icp, quote: Usd, trades: [
      { amount: 100, price: 100, type: "buy" },
      { amount: 200, price: 200, type: "buy" },
      { amount: 300, price: 300, type: "buy" }
    ]
  },
  {
    base: Velo, quote: Usd, trades: [
      { amount: 100, price: 100, type: "buy" },
      { amount: 200, price: 200, type: "buy" },
      { amount: 300, price: 300, type: "buy" }
    ]
  },
]

interface PositionsProps {
  view?: "cards" | "table" | "list"
}

const getCards = (positions: Position[]) => {
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-4">
      {
        positions.map((position, index) => (
          <PositionCard key={index} {...position} />
        ))
      }
    </div>
  )
}

// Container for rows and columns of positions
export const Positions = (props: PositionsProps) => {
  const { view } = props
  // CRUD features here. Create, Read, Update, Delete
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

// Individual Position Card
export const PositionCard = (props: Position) => {
  const { base, quote, trades } = props
  return (
    <div className="card bg-base-100 shadow-xl mb-4 bg-neutral row-span-3">
      <div className="card-body">
        <h2 className="card-title">{base.symbol}/{quote.symbol}</h2>
        {
          trades.map((trade, index) => {
            return <p key={index}>${trade.amount} @ ${quote.symbol} {trade.price}</p>
          })
        }
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Details</button>
        </div>
      </div>
    </div>
  )
}