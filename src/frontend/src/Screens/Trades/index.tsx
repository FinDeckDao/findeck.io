import { FC, useContext } from 'react'
import { Trade } from '../../Components/Trade'
import { PositionContext } from '../../Contexts/Position'
import { AssetPair } from '../../Contexts/AssetPair'
import { AssetSelector } from '../../Components/AssetSelector'
import { AssetPairContext } from '../../Contexts/AssetPair'
import { SupportedAssets } from '../../../fixtures/assets'


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

// This component displays all trades for a given asset pair.
export const TradesTable: FC<TradesProps> = (props) => {
  const { assetPair } = props
  const { positions } = useContext(PositionContext)

  const filteredPositions = positions.filter((position) => {
    return position.base.symbol === assetPair.base.symbol && position.quote.symbol === assetPair.quote.symbol
  })

  // Guard for empty positions.
  if (filteredPositions.length === 0) {
    return <div className="text-center">No trades found for {assetPair.base.symbol}/{assetPair.quote.symbol}.</div>
  }

  // Remove null values.
  // TODO: This is a temporary fix. We should not have null values in the trades array.
  const trades = filteredPositions[0].trades.filter((trade) => {
    return trade !== null
  })

  const updateTrade = (trade: Trade) => {
    console.log('Updating position:', trade)
  }

  const deleteTrade = (trade: Trade) => {
    console.log('Deleting position:', trade)
  }

  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3">Amount</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Price</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Type</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Base</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Quote</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={trade.index} className={index % 2 === 0 ? 'bg-slate-800' : ''}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3">{trade.amount}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.price}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.type}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.date}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.base.symbol}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">{trade.quote.symbol}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <button className='btn btn-primary bg-slate-800 mr-2 btn-outline uppercase py-0 h-8'
                    onClick={() => updateTrade(trade)}>
                    Update
                  </button>
                  <button className='btn btn-primary bg-slate-800 btn-outline uppercase'
                    onClick={() => deleteTrade(trade)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table >
      </div>
    </div>
  )
}

export default TradesScreen