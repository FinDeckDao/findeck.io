import { FC, useContext } from 'react'
import { AssetPair } from '../../Contexts/AssetPair'
import { AssetSelector } from '../../Components/AssetSelector'
import { AssetPairContext } from '../../Contexts/AssetPair'
import { SupportedAssets } from '../../../fixtures/assets'
import { TradesTable } from '../../Components/Trade'



// This component displays the trades screen.
export const TradesScreen: FC = () => {
  const { assetPair, setAssetPair } = useContext(AssetPairContext)

  const handleSelectedBase = (value: string) => {
    // Find the selected asset pair from the list of supported asset pairs.
    const selectedAssetPair = SupportedAssets.find((asset) => {
      return asset.symbol === value
    })

    if (selectedAssetPair && setAssetPair) {
      setAssetPair({ ...assetPair, base: selectedAssetPair })
    }
  }

  const handleSelectedQuote = (value: string) => {
    // Find the selected asset pair from the list of supported asset pairs.
    const selectedAssetPair = SupportedAssets.find((asset) => {
      return asset.symbol === value
    })

    if (selectedAssetPair && setAssetPair) {
      setAssetPair({ ...assetPair, quote: selectedAssetPair })
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold">{assetPair.base.symbol}/{assetPair.quote.symbol} Trades</h1>
      <label className="label block text-left">Base (asset you bought)
        <AssetSelector value={assetPair.base.symbol} setValue={handleSelectedBase} defaultMessage='Select the asset you purchased.' />
      </label>
      {/* TODO: Provide a selected base filter to reduce the number of available quote assets listed from the available positions */}
      <label className="label block text-left">Quote (asset you paid with)
        <AssetSelector value={assetPair.quote.symbol} setValue={handleSelectedQuote} defaultMessage='Select the asset you paid with.' />
      </label>
      <TradesTable assetPair={assetPair} />
    </div>
  )
}

export interface TradesProps {
  assetPair: AssetPair
}

export default TradesScreen