import { Asset } from "../../Lib/assets"

export interface TradeProps {
  index: number
  amount: number
  price: number
  type: "buy" | "sell"
  date: string
  base: Asset
  quote: Asset
}

export const Trade = (props: TradeProps) => {
  const { index, amount, price, type, date, base, quote } = props

  return (
    <p key={index} className="text-left m-0 text-sm">
      {amount} ${base.symbol}
      {' '}@{type === "sell" ? "-" : null}{price} ${quote.symbol}
      {' '}for {type === "sell" ? "-" : null}${amount * price} ${quote.symbol}
      {' '}on {date}
    </p>
  )
}