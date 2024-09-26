import { FC } from 'react'
import { XCircleIcon, TrashIcon } from "@heroicons/react/24/outline"  // Updated import
import { AssetPair } from '@/lib/asset'
import { useUpdateCall } from '@ic-reactor/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface WatchedAssetPairProps {
  pair: AssetPair
  index: number
  onDelete?: (pair: AssetPair) => void
}

export const WatchedAssetPair: FC<WatchedAssetPairProps> = (props) => {
  const { pair, index, onDelete } = props

  const { call: removeWatchedAsset } = useUpdateCall({
    functionName: "deleteWatchListItem"
  })

  // This assumes the removal of the asset was successful.
  // TODO: Handle the case where the asset was not removed if it becomes necessary.
  const handleDeleteConfirmation = (pair: AssetPair) => {
    if (onDelete) {
      // Removed the asset from the backend.
      removeWatchedAsset([pair])
      onDelete(pair)
    }
  }

  return (
    <div
      key={`${index}-${pair.base.symbol}-${pair.quote.symbol}`}
      className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded-2xl text-white border border-gray-700"
    >
      <div className="flex items-center space-x-2">
        <img src={pair.base.img_url} alt={pair.base.name} className="w-10 h-10" />
        <img src={pair.quote.img_url} alt={pair.quote.name} className="w-10 h-10" />
        <span>{pair.base.symbol}</span>
        <span>/</span>
        <span>{pair.quote.symbol}</span>
      </div>
      {onDelete
        ? <AlertDialog>
          <AlertDialogTrigger>
            <XCircleIcon
              className="h-5 w-5 text-gray-400 hover:text-gray-200 cursor-pointer"
            />
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-800 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                This action cannot be undone. This will permanently remove this asset
                from your watch list.
                <br /><br />
                If you want to watch this asset again, you will need to add it again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                <XCircleIcon
                  className="h-5 w-5 mr-1"
                />
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-blue-600 text-white hover:bg-blue-500"
                onClick={() => handleDeleteConfirmation(pair)}>
                <TrashIcon
                  className="h-5 w-5 mr-1"
                />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        : null
      }
    </div>
  )
}