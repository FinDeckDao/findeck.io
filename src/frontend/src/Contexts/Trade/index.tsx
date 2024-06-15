import { useState, FC, PropsWithChildren, createContext, Dispatch } from "react"
import { AssetPair } from "../AssetPair"

export interface Trade {
  amount: number
  price: number
  type: "buy" | "sell"
  date: string
  time: string
  assetPair: AssetPair
}

interface TradeContextType {
  trades: Trade[]
  setTrades: Dispatch<React.SetStateAction<Trade[]>> | null
}

// Get the existing trades from local storage.
const tradesFromLocalStorage: Trade[] = JSON.parse(
  localStorage.getItem('trades') || JSON.stringify([])
)

const defaultContext: TradeContextType = {
  trades: tradesFromLocalStorage,
  setTrades: null
}

export const TradesContext = createContext<TradeContextType>(defaultContext)

// This component provides setters and getters for the AssetPair Context.
export const TradesProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props

  // Default value is our favorite asset pair.
  const [trades, setTrades] = useState<Trade[]>([])

  return (
    <TradesContext.Provider value={{ trades, setTrades }}>
      {children}
    </TradesContext.Provider>
  )
}