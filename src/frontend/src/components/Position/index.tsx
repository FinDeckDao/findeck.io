import { Icp, Usd } from "../../lib/assets"
import { PositionProps } from "../../signals/Positions"

// This data should be store in a database for paying customers
// but for free customers, we can store it in the frontend.
const positions = [
  { base: Icp, quote: Usd, amount: 100, price: 100 },
  { base: Icp, quote: Usd, amount: 200, price: 200 },
  { base: Icp, quote: Usd, amount: 300, price: 300 }
]

export const Positions = () => {
  // CRUD features here. Create, Read, Update, Delete
  return (
    <div>
      {
        positions.map((position, index) => (
          <Position key={index} {...position} />
        ))
      }
    </div>
  )
}

export const Position = (props: PositionProps) => {
  const { base, quote, amount, price } = props

  return (
    <div>
      <button>Click me</button>
      <br />
      {base.symbol} {amount} @ {quote.symbol} {price}
    </div>
  )
}