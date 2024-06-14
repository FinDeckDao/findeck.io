import { useState, Dispatch, createContext, FC, PropsWithChildren } from "react"
import { Icp, Usd, Asset } from "../../../fixtures/assets"

export interface AssetPair {
  base: Asset
  quote: Asset
}

const defaultAssetPair: AssetPair = {
  base: Icp,
  quote: Usd
}

interface AssetPairFocusContextType {
  assetPair: AssetPair
  setAssetPair: Dispatch<React.SetStateAction<AssetPair>> | null
}

const defaultContext: AssetPairFocusContextType = {
  assetPair: defaultAssetPair,
  setAssetPair: null
}

export const AssetPairContext = createContext<AssetPairFocusContextType>(defaultContext)

// This component provides setters and getters for the AssetPair Context.
export const AssetPairProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props

  // Default value is our favorite asset pair.
  const [assetPair, setAssetPair] = useState<AssetPair>(defaultAssetPair)

  return (
    <AssetPairContext.Provider value={{ assetPair, setAssetPair }}>
      {children}
    </AssetPairContext.Provider>
  )
}