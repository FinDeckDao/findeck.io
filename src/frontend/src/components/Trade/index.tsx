import { Trade as TradeProps } from "../../Contexts/Trade"
import { Md5 } from "ts-md5"

export const Trade = (props: TradeProps) => {
  const { amount, assetPair, price, type, date, time } = props

  // Generate a unique key for this trade.
  const key = Md5.hashStr(JSON.stringify(props))

  // Guard for null props
  // TODO: Handle this in the Position Context when the trade is added to the position.
  if (!amount || !price) return <></>

  return (
    <p key={key} className="text-left m-0 mb-2 text-xs">
      {date} {time}: {type} {amount.toFixed(2)} ${assetPair.base.symbol}
      {' '}@ {(price / amount).toLocaleString("en-US", { style: "decimal" })} ${assetPair.quote.symbol}
      {' '}for {price.toFixed(2)} ${assetPair.quote.symbol}
    </p>
  )
}