import { FC } from 'react'
import { WishlistItem } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { StarIcon } from "@heroicons/react/24/solid"

export interface ResponsiveWishlistItemProps {
  item: WishlistItem
  yesAnswersCount: number
}

export const ResponsiveWishlistItem: FC<ResponsiveWishlistItemProps> = (props) => {
  const { item, yesAnswersCount } = props
  return (
    <div className="flex flex-wrap items-center gap-2" >
      <div className="flex items-center space-x-2 flex-grow min-w-0">
        <img src={item.base.img_url} alt={item.base.name} className="w-10 h-10" />
        <span className="truncate">{item.base.symbol}</span>
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

export default ResponsiveWishlistItem