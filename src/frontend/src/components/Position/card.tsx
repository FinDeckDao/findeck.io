import { useRef } from "react"
import { Position } from "."
import { TradeProps } from "../Trade"
import { OptionsModal } from "./OptionsModal"
import { TradesModal } from "./TradesModal"

// Individual Position Card
export const PositionCard = (props: Position) => {
  const { base, quote, trades } = props

  const getTotalInvested = (trades: TradeProps[]) => {
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

  const getAssetsHeld = (trades: TradeProps[]) => {
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

  // const auth = useContext(AuthContext)
  const optionModalRef = useRef<HTMLDialogElement>(null)
  const tradesModalRef = useRef<HTMLDialogElement>(null)

  const openOptionsModal = () => {
    optionModalRef.current?.showModal()
  }

  const openTradesModal = () => {
    tradesModalRef.current?.showModal()
  }

  return (
    <div className="bg-slate-800 shadow-xl rounded-xl">
      <div className="card-body">
        <h2 className="card-title">{base.symbol}/{quote.symbol}</h2>
        <p className="text-left mb-0"><span className="font-bold">Total Assets Held:</span> {getAssetsHeld(trades).toLocaleString("en-US", { style: "decimal" })} ${base.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Total At Risk:</span> {getTotalInvested(trades).toLocaleString("en-US", { style: "decimal" })} ${quote.symbol}</p>
        <p className="text-left mb-0"><span className="font-bold">Current ROI:</span> XXX-CALCULATE-THIS-XXX</p>
        <p className="text-left mb-0"><span className="font-bold">Current Position Value:</span> XXX-CALCULATE-THIS-XXX</p>
        <p className="text-left mb-0"><span className="font-bold">Cost Basis:</span> {getTotalInvested(trades) / getAssetsHeld(trades)} ${quote.symbol}</p>

        <p className="text-left mb-0"><span className="font-bold">Options:</span> (Set a limit order at X, Lower cost by adding X amount, etc...)</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary mr-4 btn-outline uppercase" onClick={openOptionsModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Options
          </button>
          <button className="btn btn-primary btn-outline uppercase" onClick={openTradesModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            View Trades
          </button>
        </div>
        <OptionsModal modalRef={optionModalRef} />
        <TradesModal modalRef={tradesModalRef} trades={trades} />
      </div>
    </div>
  )
}