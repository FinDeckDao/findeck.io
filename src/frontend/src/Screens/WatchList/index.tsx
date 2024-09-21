import { FC, useEffect, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Asset, AssetPair } from '../../lib/asset'
import { PlusCircleIcon } from "@heroicons/react/24/outline"  // Updated import
import { useQueryCall } from '@ic-reactor/react'

export const WatchList: FC = () => {
  const navigate = useNavigate()
  const [userWatchList, setUserWatchList] = useState<AssetPair[]>([])

  const navigateTo = (path: string) => {
    navigate(path)
  }

  const { call: getWatchList } = useQueryCall({
    functionName: "getlWatchListItemsForUser",
    onSuccess: (data) => {
      console.log(data)
      const watchList = data as AssetPair[]
      setUserWatchList(watchList)
    }
  })

  // Run this once to fetch the user's watch list.
  useEffect(() => {
    getWatchList()
  }, [])

  const sampleAssets: Asset[] = [
    { name: "Bitcoin", symbol: "BTC", slug: "bitcoin", img_url: "/currency-icons/bitcoin.png" },
    { name: "Ethereum", symbol: "ETH", slug: "ethereum", img_url: "/currency-icons/ethereum.png" },
    { name: "Tether", symbol: "USDT", slug: "tether", img_url: "/currency-icons/tether.png" },
    { name: "Binance Coin", symbol: "BNB", slug: "binance-coin", img_url: "/currency-icons/binance-coin.png" },
    { name: "Cardano", symbol: "ADA", slug: "cardano", img_url: "/currency-icons/cardano.png" },
  ]

  const globalWatchListItems: AssetPair[] = [
    { base: sampleAssets[0], quote: sampleAssets[1] },
    { base: sampleAssets[1], quote: sampleAssets[2] },
    { base: sampleAssets[3], quote: sampleAssets[4] },
  ]

  const renderAssetPair = (pair: AssetPair) => (
    <div key={`${pair.base.symbol}-${pair.quote.symbol}`} className="flex items-center space-x-2 mb-2 p-2 bg-gray-800 rounded-2xl text-white">
      <img src={pair.base.img_url} alt={pair.base.name} className="w-10 h-10" />
      <img src={pair.quote.img_url} alt={pair.quote.name} className="w-10 h-10" />
      <span>{pair.base.symbol}</span>
      <span>/</span>
      <span>{pair.quote.symbol}</span>
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
          <h2 className="text-2xl font-semibold mb-4">{userWatchList.length > 1 ? `Watching ${userWatchList.length} Asset Pairs` : `Watching ${userWatchList.length} Asset Pair`}</h2>
          {userWatchList.length > 0 ? (
            userWatchList.map(renderAssetPair)
          ) : (
            <p className="text-gray-300">Your watch list is empty. Add some asset pairs to get started!</p>
          )}
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Top Watch List Items</h2>
          {globalWatchListItems.map(renderAssetPair)}
        </div>
      </div>
    </div>
  )
}