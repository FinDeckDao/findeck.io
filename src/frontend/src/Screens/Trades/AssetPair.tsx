import { FC } from 'react'
import { AssetPair } from '../../../../declarations/trade_manager/trade_manager.did'

export interface AssetPairComponentProps {
  assetPair: AssetPair
}

export const AssetPairComponent: FC<AssetPairComponentProps> = (props) => {
  const { assetPair } = props
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center space-x-2 flex-grow min-w-0">
        <img
          src={`https://4a5t6-wqaaa-aaaan-qzmpq-cai.icp0.io/assets/${assetPair.base.img_url}`}
          alt={assetPair.base.name}
          className="w-10 h-10 rounded-full"
        />
        <img
          src={`https://4a5t6-wqaaa-aaaan-qzmpq-cai.icp0.io/assets/${assetPair.quote.img_url}`}
          alt={assetPair.base.name}
          className="w-10 h-10 rounded-full"
        />
        <span className="truncate font-medium">{assetPair.base.symbol}</span>
        <span>/</span>
        <span className="truncate font-medium">{assetPair.quote.symbol}</span>
      </div>
    </div>
  )
}

export default AssetPairComponent