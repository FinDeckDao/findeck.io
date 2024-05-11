import { Asset } from '../../../fixtures/assets'

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
    <p key={index} className="text-left m-0 mb-2 text-xs">
      {date}: {type} {amount.toFixed(2)} ${base.symbol}
      {' '}@ {(price / amount).toLocaleString("en-US", { style: "decimal" })} ${quote.symbol}
      {' '}for {price.toFixed(2)} ${quote.symbol}
    </p>
  )
}