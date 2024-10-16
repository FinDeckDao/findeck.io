import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { FC } from "react"
import { CreateWishlistItem } from "./CreateWishlistItem"

interface CreateWishlistItemDialogProps {
  onUpdated: () => void
}

export const CreateWishlistItemDialog: FC<CreateWishlistItemDialogProps> = (props) => {
  const { onUpdated } = props
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-800">
          <PlusCircleIcon className="mr-2 h-5 w-5" /> Create Wishlist Item
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95%] max-w-[95%] xs:max-w-[400px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] bg-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogTitle className="bg-gray-800 text-white mb-0">
          Creating a Wishlist Item
        </DialogTitle>
        <div className="py-4">
          <CreateWishlistItem onUpdated={onUpdated} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}