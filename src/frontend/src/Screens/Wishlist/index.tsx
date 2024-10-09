import { FC, useEffect, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { useNavigate } from 'react-router-dom'
import { WishlistItem } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { PlusCircleIcon } from "@heroicons/react/24/outline"  // Updated import
import { TbFidgetSpinner } from "react-icons/tb"
import { WatchedWishlistItem } from './WatchedWishlistItem'
import { useWishlistManagerQueryCall } from '@/Providers/WishlistManager'

export const Wishlist: FC = () => {
  const navigate = useNavigate()
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([])
  const [topWishlist, setTopWishlist] = useState<WishlistItem[]>([])

  const navigateTo = (path: string) => {
    navigate(path)
  }

  const { call: getUserWishlist, loading } = useWishlistManagerQueryCall({
    functionName: "getUserWishlist",
    onSuccess: (data) => {
      const userWishlist = data as WishlistItem[]
      setUserWishlist(userWishlist)
    }
  })

  const { call: getTopWatchedAssets, loading: topLoading } = useWishlistManagerQueryCall({
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
      <h1 className="text-4xl font-bold text-center mb-6">wishlist</h1>

      <div className="flex justify-end mb-6">
        <Button
          onClick={() => navigateTo('/wishlist/create')}
          className="bg-blue-400 hover:bg-blue-500 text-white w-full sm:w-auto"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" /> wishlist Item
        </Button>
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

          {
            loading
              ? (
                <div className="mb-4">
                  Fetching your current wishlist...{" "}
                  <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" />
                </div>
              )
              : null
          }

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
                {!loading ? "Your wishlist is empty. Add some asset pairs to get started!" : null}
              </p>
            )
          }
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Top wishlist Items</h2>

          {topLoading
            ? (
              <div className="mb-4">
                Checking Top Watched Asset Pairs...{" "}
                <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" />
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