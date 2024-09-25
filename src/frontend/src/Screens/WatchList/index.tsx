import { FC, useEffect, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { useNavigate } from 'react-router-dom'
import { AssetPair } from '../../lib/asset'
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"  // Updated import
import { TbFidgetSpinner } from "react-icons/tb"
import { useQueryCall } from '@ic-reactor/react'

export const WatchList: FC = () => {
  const navigate = useNavigate()
  const [userWatchList, setUserWatchList] = useState<AssetPair[]>([])
  const [topWatchList, setTopWatchList] = useState<AssetPair[]>([])

  const navigateTo = (path: string) => {
    navigate(path)
  }

  const { call: getUserWatchList, loading } = useQueryCall({
    functionName: "getUserWatchList",
    onSuccess: (data) => {
      const userWatchList = data as AssetPair[]
      setUserWatchList(userWatchList)
    }
  })

  const { call: getTopWatchedAssets, loading: topLoading } = useQueryCall({
    functionName: "getTopWatchedAssets",
    onSuccess: (data) => {
      console.log("Top Watched", data)
      const topWatchList = data as AssetPair[]
      setTopWatchList(topWatchList)
    }
  })

  // Run this once to fetch the user's watch list.
  useEffect(() => {
    getUserWatchList()
    getTopWatchedAssets()
  }, [])

  const renderAssetPair = (pair: AssetPair, index: number) => (
    <div
      key={`${index}-${pair.base.symbol}-${pair.quote.symbol}`}
      className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded text-white"
    >
      <div className="flex items-center space-x-2">
        <img src={pair.base.img_url} alt={pair.base.name} className="w-10 h-10" />
        <img src={pair.quote.img_url} alt={pair.quote.name} className="w-10 h-10" />
        <span>{pair.base.symbol}</span>
        <span>/</span>
        <span>{pair.quote.symbol}</span>
      </div>
      <XCircleIcon className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
    </div>
  )

  return (
    <div className="container mx-auto min-h-96 p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Watch List</h1>

      <div className="flex justify-end mb-6">
        <Button
          onClick={() => navigateTo('/watchlist/create')}
          className="bg-blue-400 hover:bg-blue-500 text-white w-full sm:w-auto"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" /> Watch List Item
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="mb-8 lg:mb-0 lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">
            {
              userWatchList.length > 1
                ? `Watching ${userWatchList.length} Asset Pairs`
                : `Watching ${userWatchList.length} Asset Pair`
            }
          </h2>

          {
            loading
              ? (
                <div className="mb-4">
                  Checking Your Watchlist...{" "}
                  <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" />
                </div>
              )
              : null
          }

          {
            userWatchList.length > 0 ? (
              userWatchList.map(renderAssetPair)
            ) : (
              <p className="text-gray-300">
                Your watch list is empty. Add some asset pairs to get started!
              </p>
            )
          }
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Top Watch List Items</h2>

          {
            topLoading
              ? (
                <div className="mb-4">
                  Checking Top Watched Asset Pairs...{" "}
                  <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" />
                </div>
              )
              : null
          }

          {topWatchList.map((assetPair, index) => renderAssetPair(assetPair, index))}
        </div>
      </div>
    </div>
  )
}