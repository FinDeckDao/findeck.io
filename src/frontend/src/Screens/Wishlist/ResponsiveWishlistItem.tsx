import React from 'react'
import { WishlistItem } from '../../../../declarations/wishlist_manager/wishlist_manager.did'

export interface ResponsiveWishlistItemProps {
  item: WishlistItem
  yesAnswersCount: number
}

const TOTAL_QUESTIONS = 10 // Total number of due diligence questions

export const ResponsiveWishlistItem: React.FC<ResponsiveWishlistItemProps> = ({ item, yesAnswersCount }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center space-x-2 flex-grow min-w-0">
        <img
          src={`https://4a5t6-wqaaa-aaaan-qzmpq-cai.icp0.io/assets/${item.base.img_url}`}
          alt={item.base.name}
          className="w-10 h-10 rounded-full"
        />
        <span className="truncate font-medium">{item.base.symbol}</span>
      </div>
      <div className="bg-gray-600 rounded-full ml-4 px-2 py-1 text-sm font-semibold">
        <span className="text-white">{yesAnswersCount}</span>
        <span className="text-white"> / {TOTAL_QUESTIONS}</span>
      </div>
    </div>
  )
}

export default ResponsiveWishlistItem