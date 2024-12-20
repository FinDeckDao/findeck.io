import { FC } from 'react'
import { AssetPair } from '../../../../../declarations/trade_manager/trade_manager.did'
import { Badge } from "@/components/ui/badge"
import CurrencyList from 'currency-list'
import { CurrencyFlag } from '@/Components/Currency/CurrencyFlag'

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
        {
          assetPair.quote.img_url != ''
            ? <img
              src={`https://4a5t6-wqaaa-aaaan-qzmpq-cai.icp0.io/assets/${assetPair.quote.img_url}`}
              alt={assetPair.base.name}
              className="w-10 h-10 rounded-full"
            />
            : <Badge className="bg-slate-700 text-slate-900 text-lg rounded-full px-2 py-1 hover:bg-slate-100 hover:text-slate-900 h-10">
              <CurrencyFlag countryCode={CurrencyList.get(assetPair.quote.symbol).code} />
            </Badge>
        }

        <span className="truncate font-medium">{assetPair.base.symbol}</span>
        <span>/</span>
        <span className="truncate font-medium">{assetPair.quote.symbol}</span>
      </div>
    </div>
  )
}
