import { FC, useEffect, useState } from 'react'
import { WishlistItem } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { WatchedWishlistItem } from './WatchedWishlistItem'
import { useWishlistManagerQueryCall } from '@/Providers/WishlistManager'
import { CreateWishlistItemDialog } from './CreateWishlistItemDialog'
import { LoaderWithExplanation } from '@/Components/Loaders'

export const Wishlist: FC = () => {
  // const navigate = useNavigate()
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([])
  const [topWishlist, setTopWishlist] = useState<WishlistItem[]>([])

  const { call: getUserWishlist, loading } = useWishlistManagerQueryCall({
    functionName: "getUserWishlist",
    onSuccess: (data) => {
      const userWishlist = data as WishlistItem[]
      setUserWishlist(userWishlist)
    }
  })

  const { call: getTopWatchedAssets } = useWishlistManagerQueryCall({
    functionName: "getTopWatchedAssets",
    onSuccess: (data) => {
      const topWishlist = data as WishlistItem[]
      setTopWishlist(topWishlist)
    }
  })

  // Run this once to fetch the user's wishlist.
  useEffect(() => {
    getUserWishlist()
    getTopWatchedAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeletedAsset = (pair: WishlistItem) => {
    const updatedWishlist = userWishlist.filter((p) => p !== pair)
    setUserWishlist(updatedWishlist)
    getUserWishlist()
  }

  return (
    <div className="container mx-auto min-h-96 p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Wishlist</h1>

      <div className="flex justify-end mb-6">
        <CreateWishlistItemDialog onUpdated={getUserWishlist} />
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="mb-8 lg:mb-0 lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">
            {
              userWishlist.length > 1
                ? `Watching ${userWishlist.length} Assets`
                : `Watching ${userWishlist.length} Asset`
            }
          </h2>

          {loading && (<LoaderWithExplanation explanation='Fetching your current wishlist...' className="mb-4" align='left' />)}

          {userWishlist.length > 0
            ? (
              userWishlist.map((item, index) => {
                return <WatchedWishlistItem
                  key={`${item.base.symbol}-${index}`}
                  item={item} index={index}
                  onDelete={handleDeletedAsset}
                  onUpdate={getUserWishlist}
                />
              })
            )
            : (
              <p className="text-gray-300">
                {!loading ? "Your wishlist is empty. Create a wishlist item to get started!" : null}
              </p>
            )
          }
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Top wishlist Items</h2>
          {
            loading
              ? (
                <div className="mb-4">
                  &nbsp;
                </div>
              )
              : null
          }

          {topWishlist.map((item, index) => {
            return (
              <WatchedWishlistItem
                key={`${item.base.symbol}-${index}`}
                item={item} index={index}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}