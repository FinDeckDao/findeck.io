import { Icp, Usd, Velo, Asset } from "../../lib/assets"
// import { position } from "./signal"

type Trade = {
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
    <div className="grid grid-rows-3 grid-flow-col gap-4">
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

// Individual Position Card
export const PositionCard = (props: Position) => {
  const { base, quote, trades } = props

  const getTotalInvested = (trades: Trade[]) => {
    // Get the value of all long trades.
    const longTrades = trades.filter((value) => {
      return value.type === "buy"
    })

    // Get the totals value of all long trades.
    const longTotal = longTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount * currentValue.price
    }, 0)

    // Get the value of all short trades.
    const shortTrades = trades.filter((value) => {
      return value.type === "sell"
    })

    // Get the totals value of all short trades.
    const shortTotal = shortTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount * currentValue.price
    }, 0)

    // Return the total value of the position.
    return longTotal - shortTotal
  }

  const getAssetsHeld = (trades: Trade[]) => {
    // Get the value of all long trades.
    const longTrades = trades.filter((value) => {
      return value.type === "buy"
    })

    // Get the totals value of all long trades.
    const longTotal = longTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0)

    // Get the value of all short trades.
    const shortTrades = trades.filter((value) => {
      return value.type === "sell"
    })

    // Get the totals value of all short trades.
    const shortTotal = shortTrades.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0)

    // Return the total value of the position.
    return longTotal - shortTotal
  }

  return (
    <div className="card bg-neutral shadow-xl mb-4 row-span-3">
      <div className="card-body">
        <h2 className="card-title">{base.symbol}/{quote.symbol}</h2>
        <h2 className="text-left"><span className="font-bold">Total Assets Held:</span> {getAssetsHeld(trades).toLocaleString("en-US", { style: "decimal" })} ${base.symbol}</h2>
        <h2 className="text-left"><span className="font-bold">Total At Risk:</span> {getTotalInvested(trades).toLocaleString("en-US", { style: "decimal" })} ${quote.symbol}</h2>
        <h2 className="text-left"><span className="font-bold">Current ROI:</span> XXX-CALCULATE-THIS-XXX</h2>
        <h2 className="text-left"><span className="font-bold">Current Position Value:</span> XXX-CALCULATE-THIS-XXX</h2>
        <h2 className="text-left"><span className="font-bold">Cost Basis:</span> {getTotalInvested(trades) / getAssetsHeld(trades)} ${quote.symbol}</h2>
        <h2 className="text-left"><span className="font-bold">Trades:</span></h2>
        {
          trades.map((trade, index) => {
            return <p key={index}>
              {trade.amount} ${base.symbol}
              @ {trade.type === "sell" ? "-" : null}{trade.price} ${quote.symbol}
              totalling {trade.type === "sell" ? "-" : null}${trade.amount * trade.price} {quote.symbol}
              {" "}***add a date to this***
            </p>
          })
        }
        <h2 className="text-left"><span className="font-bold">Options:</span> (Set a limit order at X, Lower cost by adding X amount, etc...)</h2>
        <div className="card-actions justify-end">
          <button className="btn btn-primary mr-4 btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Options
          </button>
          <button className="btn btn-primary btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            View Trades
          </button>
        </div>
      </div>
    </div>
  )
}