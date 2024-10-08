import React, { useState, useRef, useCallback, useMemo } from 'react'
import { SearchableCurrencyList, SearchableCurrencyListRef } from './Search'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Asset, AssetPair } from '../../lib/asset'
import { AssetPair as AssetPairType } from "../../../../declarations/backend/backend.did"
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { useUpdateCall } from '@ic-reactor/react'
import { TbFidgetSpinner } from "react-icons/tb"
import { DueDiligenceQuestionnaire } from './Questionnaire'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Answer = { Yes: null } | { No: null }

export const CreateWatchListItem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('base')
  const [selectedBase, setSelectedBase] = useState<Asset | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<Asset | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])

  const handleAnswersChange = (newAnswers: Answer[]) => {
    setAnswers(newAnswers)
  }

  const baseListRef = useRef<SearchableCurrencyListRef>(null)
  const quoteListRef = useRef<SearchableCurrencyListRef>(null)

  const assetPair = useMemo<AssetPair | null>(() => {
    if (selectedBase && selectedQuote) {
      return { base: selectedBase, quote: selectedQuote }
    }
    return null
  }, [selectedBase, selectedQuote])

  // Update the backend with this asset.
  const { call: createWatchListItem, loading } = useUpdateCall({
    functionName: "createWatchListItem",
    onSuccess: () => {
      setSelectedBase(null)
      setSelectedQuote(null)
    }
  })

  const handleBaseSelect = useCallback((asset: Asset | null) => {
    setSelectedBase(asset)
  }, [])

  const handleQuoteSelect = useCallback((asset: Asset | null) => {
    setSelectedQuote(asset)
  }, [])

  const handleCreateWatchListItem = useCallback(() => {
    if (assetPair) {
      console.log('Creating watch list item:', assetPair)
      baseListRef.current?.clearState()
      quoteListRef.current?.clearState()

      // Construct an asset pair.
      const newAssetPair: AssetPairType = {
        base: assetPair.base,
        quote: assetPair.quote,
        DueDiligence: answers
      }

      createWatchListItem([newAssetPair])
    }
  }, [assetPair, createWatchListItem, answers])

  return (
    <div className="container mx-auto min-h-96 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/watchlist">Watch List</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Create Watch List Item</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold text-center mt-10 mb-6">Create A Watch List Item</h1>

      {/* Selected Assets Display */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Selected Asset Pair</h2>
        {assetPair ? (
          <>
            <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white">
              <img src={assetPair.base.img_url} alt={assetPair.base.name} className="w-10 h-10" />
              <span>{assetPair.base.symbol}</span>
              <span>/</span>
              <img src={assetPair.quote.img_url} alt={assetPair.quote.name} className="w-10 h-10" />
              <span>{assetPair.quote.symbol}</span>
            </div>
            <DueDiligenceQuestionnaire onAnswersChange={handleAnswersChange} isModalOpen={false} />
          </>
        ) : (
          <p className="text-gray-400">
            Please search for a base asset and quote asset. Click on the item you want to select it.
          </p>
        )}
      </div>

      {/* Create Button and status update */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex-grow">
          {loading && (
            <span>
              Adding {`${selectedBase?.symbol}/${selectedQuote?.symbol}`} To Your Watchlist...{" "}
              <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" />
            </span>
          )}
        </div>
        <Button
          onClick={handleCreateWatchListItem}
          disabled={loading ? true : !assetPair}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? null : <PlusCircleIcon className="mr-2 h-5 w-5" />}
          {loading ? "Adding item..." : "Add Pair To Watch List"}
          {loading ? <TbFidgetSpinner className="h-5 w-5 animate-spin inline-block" /> : null}
        </Button>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 mb-4">
            <TabsTrigger
              value="base"
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              Base Asset
            </TabsTrigger>
            <TabsTrigger
              value="quote"
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              Quote Asset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="base">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Asset You're Buying (Base)</h2>
              <SearchableCurrencyList ref={baseListRef} onSelect={handleBaseSelect} />
            </div>
          </TabsContent>

          <TabsContent value="quote">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Asset You'll Used To Pay (Quote)</h2>
              <SearchableCurrencyList ref={quoteListRef} onSelect={handleQuoteSelect} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex lg:space-x-4 mt-8">
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Asset You're Buying (Base)</h2>
          <SearchableCurrencyList ref={baseListRef} onSelect={handleBaseSelect} />
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Asset You'll Used To Pay (Quote)</h2>
          <SearchableCurrencyList ref={quoteListRef} onSelect={handleQuoteSelect} />
        </div>
      </div>
    </div>
  )
}