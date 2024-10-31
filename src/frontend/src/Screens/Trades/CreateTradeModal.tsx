import { FC, useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreateTrade } from './CreateTrade'
import { WishlistItem } from "../../../../declarations/wishlist_manager/wishlist_manager.did"
import { Trade, TradeType } from "../../../../declarations/trade_manager/trade_manager.did"
import { useWishlistManagerQueryCall } from '@/Providers/WishlistManager'
import { useTradeManagerUpdateCall } from "@/Providers/tradeManager"
import { LoaderWithExplanation } from "@/Components/Loaders"

interface CreateTradeModalProps {
  openClose: boolean
  toggleOpenClose: (open: boolean) => void
}

export const CreateTradeModal: FC<CreateTradeModalProps> = (props) => {
  const { openClose, toggleOpenClose } = props
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([] as WishlistItem[])
  const [tradeData, setTradeData] = useState<Partial<Trade>>({})
  const [isFormComplete, setIsFormComplete] = useState(false)

  const { data: wishList, loading: wishlistLoading, error: wishlistError } = useWishlistManagerQueryCall({
    functionName: "getUserWishlist",
    onSuccess: (data) => {
      if (data) {
        const userWishlist = data as WishlistItem[]
        setUserWishlist(userWishlist)
      }
    }
  })

  const {
    call: createTrade,
    loading: createTradeLoading,
    error: createTradeError
  } = useTradeManagerUpdateCall({
    functionName: "createTrade",
    onSuccess: () => {
      console.log("Trade created successfully")
      toggleOpenClose(false)
    }
  })

  useEffect(() => {
    const isComplete = !!(
      tradeData.assetPair?.base &&
      tradeData.assetPair?.quote &&
      tradeData.baseAssetAmount &&
      tradeData.quoteAssetAmount
    )
    setIsFormComplete(isComplete)
  }, [tradeData])

  const handleCreateTrade = () => {
    if (tradeData.assetPair && tradeData.baseAssetAmount && tradeData.quoteAssetAmount) {
      // Convert bigint to number for the API call
      const baseAmount = Number(tradeData.baseAssetAmount)
      const quoteAmount = Number(tradeData.quoteAssetAmount)

      // This modal is about creating a trade.
      const tradeType: TradeType = { 'buy': null }

      // Call the createTrade function with the correct parameters
      createTrade([tradeData.assetPair, baseAmount, quoteAmount, tradeType, []])
    } else {
      console.error('Incomplete trade data')
    }
  }

  const handleTradeDataChange = (newData: Partial<Trade>) => {
    setTradeData(prevData => ({ ...prevData, ...newData }))
  }

  if (wishlistLoading) {
    return <div className="mb-4">
      <LoaderWithExplanation explanation="Adding wishlist items as trading options..." />
    </div>
  }
  if (!wishList) { return <>Wishlist Data isn't available.</> }
  if (wishlistError) { return <>Error loading Wishlist. Please try again.</> }
  if (createTradeError) { return <>Error creating new trade. Please try again.</> }

  return (
    <Dialog open={openClose} onOpenChange={toggleOpenClose}>
      <DialogContent
        className="bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className='m-0'>
            Record A Trade
          </DialogTitle>
          <DialogDescription>
            Enter the details of the trade you would like to create.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CreateTrade userWishlist={userWishlist} onTradeDataChange={handleTradeDataChange} />
        </div>
        <div className="bg-gray-800 pt-4 pb-2 flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => toggleOpenClose(false)}
            className="bg-blue-400 hover:bg-blue-500 text-white w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleCreateTrade}
            disabled={createTradeLoading || !isFormComplete}
            className={
              `flex items-center justify-center space-x-2 ${createTradeLoading || !isFormComplete
                ? 'cursor-not-allowed bg-blue-400 hover:bg-blue-500 text-white'
                : 'bg-blue-400 hover:bg-blue-500 text-white'}
                      w-full sm:w-auto`
            }
          >
            {createTradeLoading
              ? (<LoaderWithExplanation explanation="Updating..." />)
              : (
                <>
                  <span>Update</span>
                </>
              )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}