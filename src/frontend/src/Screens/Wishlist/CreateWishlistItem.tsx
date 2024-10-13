import React, { useState, useRef, useCallback, useMemo } from 'react'
import { SearchableCurrencyList, SearchableCurrencyListRef } from '../../Components/Currency/SearchableCurrencyList'
import { WishlistItem, Asset, Answer } from "../../../../declarations/wishlist_manager/wishlist_manager.did"
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { TbFidgetSpinner } from "react-icons/tb"
import { DueDiligenceQuestionnaire } from './Questionnaire'
import { useWishlistManagerUpdateCall } from '@/Providers/WishlistManager'

export const CreateWishlistItem: React.FC = () => {
  const [selectedWishlistItem, setSelectedWishlistItem] = useState<WishlistItem | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])

  const handleAnswersChange = (newAnswers: Answer[]) => {
    setAnswers(newAnswers)
  }

  const baseListRef = useRef<SearchableCurrencyListRef>(null)
  const quoteListRef = useRef<SearchableCurrencyListRef>(null)

  const wishlistItem = useMemo<WishlistItem | null>(() => {
    if (selectedWishlistItem) {
      return selectedWishlistItem
    }
    return null
  }, [selectedWishlistItem])

  // Update the backend with this asset.
  const { call: createWishlistItem, loading } = useWishlistManagerUpdateCall({
    functionName: "createWishlistItem",
    onSuccess: () => {
      setSelectedWishlistItem(null)
    }
  })

  const handleBaseSelect = useCallback((item: Asset | null) => {
    if (!item) return
    const newWishlistItem: WishlistItem = {
      base: item,
      DueDiligence: answers
    }
    setSelectedWishlistItem(newWishlistItem)
  }, [answers])

  const handleCreateWishlistItem = useCallback(() => {
    if (wishlistItem) {
      console.log('Creating wish list item:', wishlistItem)
      baseListRef.current?.clearState()
      quoteListRef.current?.clearState()

      // Construct an asset pair.
      const newAssetPair: WishlistItem = {
        base: wishlistItem.base,
        DueDiligence: answers
      }

      createWishlistItem([newAssetPair])
    }
  }, [wishlistItem, createWishlistItem, answers])

  return (
    <div className="container mx-auto min-h-96">
      {/* Selected Assets Display */}
      {selectedWishlistItem && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Selected Asset</h2>
          {wishlistItem ? (
            <>
              <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white">
                <img src={`https://4a5t6-wqaaa-aaaan-qzmpq-cai.icp0.io/assets/${wishlistItem.base.img_url}`} alt={wishlistItem.base.name} className="w-10 h-10" />
                <span>{wishlistItem.base.symbol}</span>
              </div>
              <DueDiligenceQuestionnaire onAnswersChange={handleAnswersChange} isModalOpen={false} />
            </>
          ) : (
            <p className="text-gray-400">
              Please search for an asset. Click on the asset you want to select it.
            </p>
          )}
        </div>
      )}

      {/* Create Button and status update */}
      {selectedWishlistItem && (
        <div className="mt-4 flex justify-between items-center">
          <div className="flex-grow">
            {loading && (
              <span>
                Adding {`${selectedWishlistItem?.base.symbol}`} To Your Wishlist...{" "}
                <TbFidgetSpinner className="h-6 w-6 animate-spin inline-block" />
              </span>
            )}
          </div>
          <Button
            onClick={handleCreateWishlistItem}
            disabled={loading ? true : !wishlistItem}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? null : <PlusCircleIcon className="mr-2 h-5 w-5" />}
            {loading ? "Adding item..." : "Add Pair To Wish List"}
            {loading ? <TbFidgetSpinner className="h-5 w-5 animate-spin inline-block" /> : null}
          </Button>
        </div>
      )}


      {/* Desktop view */}
      {!selectedWishlistItem && (
        <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-[95%] mx-auto xs:max-w-[400px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] lg:w-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">
            Select an Asset You Want
          </h2>

          <SearchableCurrencyList ref={baseListRef} onSelect={handleBaseSelect} />
        </div>
      )}
    </div>
  )
}