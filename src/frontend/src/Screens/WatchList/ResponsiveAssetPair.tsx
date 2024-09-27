import { FC } from 'react'
import { AssetPair } from '../../../../declarations/backend/backend.did'
import { StarIcon } from "@heroicons/react/24/solid"

export interface ResponsiveAssetPairProps {
  pair: AssetPair
  yesAnswersCount: number
}

export const ResponsiveAssetPair: FC<ResponsiveAssetPairProps> = (props) => {
  const { pair, yesAnswersCount } = props
  return (
    <div className="flex flex-wrap items-center gap-2" >
      <div className="flex items-center space-x-2 flex-grow min-w-0">
        <img src={pair.base.img_url} alt={pair.base.name} className="w-10 h-10" />
        <img src={pair.quote.img_url} alt={pair.quote.name} className="w-10 h-10" />
        <span className="truncate">{pair.base.symbol}</span>
        <span>/</span>
        <span className="truncate">{pair.quote.symbol}</span>
      </div>
      <div className="flex items-center w-full sm:w-auto">
        <div className="relative inline-flex h-5">
          {[...Array(yesAnswersCount)].map((_, i) => (
            <StarIcon
              key={i}
              className="h-5 w-5 text-yellow-400 absolute"
              style={{ left: `${i * 18}px`, top: '50%', transform: 'translateY(-50%)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResponsiveAssetPair