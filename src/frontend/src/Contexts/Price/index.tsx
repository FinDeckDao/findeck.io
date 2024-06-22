import { useState, FC, PropsWithChildren, createContext, Dispatch } from "react"
import { AssetPair } from "../AssetPair"

export interface Price {
  asasetPair: AssetPair,
  price: number,
  date: string,
}

interface PriceContextType {
  prices: Price[]
  setPrices: Dispatch<React.SetStateAction<Price[]>> | null
}

// Get the existing trades from local storage.
const pricesFromLocalStorage: Price[] = JSON.parse(
  localStorage.getItem('prices') || JSON.stringify([])
)

const defaultContext: PriceContextType = {
  prices: pricesFromLocalStorage,
  setPrices: null
}

export const PricesContext = createContext<PriceContextType>(defaultContext)

// This component provides setters and getters for the AssetPair Context.
export const PricesProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props

  // Default value is our favorite asset pair.
  const [prices, setPrices] = useState<Price[]>(pricesFromLocalStorage)

  return (
    <PricesContext.Provider value={{ prices, setPrices }}>
      {children}
    </PricesContext.Provider>
  )
}