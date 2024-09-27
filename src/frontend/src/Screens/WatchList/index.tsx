import { FC, useEffect, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { useNavigate } from 'react-router-dom'
import { AssetPair } from '../../../../declarations/backend/backend.did'
import { PlusCircleIcon } from "@heroicons/react/24/outline"  // Updated import
import { TbFidgetSpinner } from "react-icons/tb"
import { useQueryCall } from '@ic-reactor/react'
import { WatchedAssetPair } from './AssetPair'

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
      const topWatchList = data as AssetPair[]
      setTopWatchList(topWatchList)
    }
  })

  // Run this once to fetch the user's watch list.
  useEffect(() => {
    getUserWatchList()
    getTopWatchedAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeletedAsset = (pair: AssetPair) => {
    const updatedWatchList = userWatchList.filter((p) => p !== pair)
    setUserWatchList(updatedWatchList)
    getUserWatchList()
  }

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
                  Fetching your current watchlist...{" "}
                  <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" />
                </div>
              )
              : null
          }

          {
            userWatchList.length > 0 ? (
              userWatchList.map((pair, index) => {
                return <WatchedAssetPair
                  key={`${pair.base.symbol}/${pair.quote.symbol}-${index}`}
                  pair={pair} index={index}
                  onDelete={handleDeletedAsset}
                  onUpdate={getUserWatchList}
                />
              })
            ) : (
              <p className="text-gray-300">
                {!loading ? "Your watch list is empty. Add some asset pairs to get started!" : null}
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

          {topWatchList.map((pair, index) => {
            return (
              <WatchedAssetPair
                key={`${pair.base.symbol}/${pair.quote.symbol}-${index}`}
                pair={pair} index={index}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}