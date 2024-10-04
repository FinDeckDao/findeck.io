import { FC } from "react"
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
import { WishlistItem } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { XCircleIcon, TrashIcon } from "@heroicons/react/24/outline"

export interface DeleteGuardProps {
  item: WishlistItem
  handleDeleteConfirmation: (item: WishlistItem) => void
}

export const DeleteGuard: FC<DeleteGuardProps> = (props) => {
  const { item, handleDeleteConfirmation } = props
  return (
    <AlertDialog>
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
            <XCircleIcon className="h-5 w-5 mr-1" />
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 text-white hover:bg-blue-500"
            onClick={() => handleDeleteConfirmation(item)}>
            <TrashIcon className="h-5 w-5 mr-1" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}