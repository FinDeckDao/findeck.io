import { FC, useState } from 'react'
import { WishlistItem, Answer } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { useWishlistManagerUpdateCall } from '@/Providers/WishlistManager'
import { DeleteGuard } from './DeleteGuard'
import { ResponsiveWishlistItem } from './ResponsiveWishlistItem'
import { EditWishlistItem } from './EditWishlistItem'

interface WatchedWishlistItemProps {
  item: WishlistItem
  index: number
  onDelete?: (item: WishlistItem) => void
  onUpdate?: () => void
}

export const WatchedWishlistItem: FC<WatchedWishlistItemProps> = (props) => {
  const { item, index, onDelete, onUpdate } = props
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatedAnswers, setUpdatedAnswers] = useState(item.DueDiligence)

  const { call: removeWatchedAsset } = useWishlistManagerUpdateCall({
    functionName: "deleteWishlistItem"
  })

  const { call: updateWishlistItem, loading: updateLoading } = useWishlistManagerUpdateCall({
    functionName: "createWishlistItem",
    onSuccess: () => {
      setIsDialogOpen(false)
      if (onUpdate) {
        onUpdate()
      }
    }
  })

  const handleDeleteConfirmation = (item: WishlistItem) => {
    if (onDelete) {
      removeWatchedAsset([item])
      onDelete(item)
    }
  }

  const handleUpdateConfirmation = () => {
    const updatedPair = { ...item, DueDiligence: updatedAnswers }
    updateWishlistItem([updatedPair])
  }

  const handleAnswersUpdate = (answers: Answer[]) => {
    setUpdatedAnswers(answers)
  }

  const yesAnswersCount = item.DueDiligence.filter(answer => 'Yes' in answer).length

  return (
    <div
      key={`${index}-${item.base.symbol}`}
      className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded-2xl text-white 
                border border-gray-700"
    >
      <ResponsiveWishlistItem item={item} yesAnswersCount={yesAnswersCount} />

      {onDelete && (
        <div className="flex items-center space-x-2">
          <EditWishlistItem
            item={item}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleAnswersUpdate={handleAnswersUpdate}
            handleUpdateConfirmation={handleUpdateConfirmation}
            updateLoading={updateLoading}
          />

          <DeleteGuard
            item={item}
            handleDeleteConfirmation={handleDeleteConfirmation}
          />
        </div>
      )}
    </div>
  )
}