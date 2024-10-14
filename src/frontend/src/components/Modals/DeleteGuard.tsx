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
import { Trade } from '../../../../declarations/trade_manager/trade_manager.did'

export type Deletable = WishlistItem | Trade

export interface DeleteGuardProps {
  item: Deletable
  message: string
  onDelete: (item: Deletable) => void
}

export const DeleteGuard: FC<DeleteGuardProps> = (props) => {
  const { item, message, onDelete } = props

  const handleDeleteConfirmation = (item: Deletable) => {
    if (onDelete) {
      onDelete(item)
    }
  }

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
            {message}
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