import { FC } from 'react'
import { XCircleIcon, TrashIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import { AssetPair } from '../../../../declarations/backend/backend.did'
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
  simple?: boolean
}

export const WatchedAssetPair: FC<WatchedAssetPairProps> = (props) => {
  const { pair, index, onDelete } = props

  const { call: removeWatchedAsset } = useUpdateCall({
    functionName: "deleteWatchListItem"
  })

  const handleDeleteConfirmation = (pair: AssetPair) => {
    if (onDelete) {
      removeWatchedAsset([pair])
      onDelete(pair)
    }
  }

  const yesAnswersCount = pair.DueDiligence.filter(answer => 'Yes' in answer).length

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
        <div className="flex items-center">
          <div className="relative inline-flex h-5">
            {[...Array(yesAnswersCount)].map((_, i) => (
              <StarIcon
                key={i}
                className="h-5 w-5 text-yellow-400 absolute"
                style={{ left: `${i * 18}px`, top: '-60%', transform: 'translateY(50%)' }}
              />
            ))}
          </div>
        </div>
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