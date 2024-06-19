import { FC } from "react"
import { SupportedAssets, Asset } from "../../../../fixtures/assets"

interface AssetSelectorProps {
  value: string
  setValue: (assetSymbol: string) => void
  defaultMessage: string
}

export const AssetSelector: FC<AssetSelectorProps> = (props) => {
  const { value, setValue, defaultMessage } = props

  // TODO: Dry this up.
  const handleSelectedBase = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAsset: Asset | undefined = SupportedAssets.find((asset) => {
      if (asset.symbol === event.currentTarget.value) {
        return asset.symbol
      }
    })

    if (selectedAsset) {
      setValue(selectedAsset.symbol)
    }
  }

  return (
    <select
      className="select w-full mt-1 mb-4 bg-slate-800"
      onChange={handleSelectedBase}
      value={value}
    >
      <option disabled value=''>{defaultMessage}</option>
      {
        SupportedAssets.sort().map((asset) => {
          return <option key={asset.symbol} value={asset.symbol}>${asset.symbol} ({asset.name}) </option>
        })
      }
    </select>
  )
}