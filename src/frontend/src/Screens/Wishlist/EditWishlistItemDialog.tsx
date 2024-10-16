import { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { DueDiligenceQuestionnaire } from './Questionnaire'
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { WishlistItem, Answer } from '../../../../declarations/wishlist_manager/wishlist_manager.did'
import { Button } from "@/components/ui/button"
import { TbFidgetSpinner } from "react-icons/tb"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { Save } from 'lucide-react'

interface EditWishlistItemProps {
  item: WishlistItem
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleAnswersUpdate: (answers: Answer[]) => void
  handleUpdateConfirmation: () => void
  updateLoading: boolean
}

export const EditWishlistItemDialog: FC<EditWishlistItemProps> = (props) => {
  const {
    item,
    isDialogOpen,
    setIsDialogOpen,
    handleAnswersUpdate,
    handleUpdateConfirmation,
    updateLoading
  } = props

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <PencilSquareIcon className="h-5 w-5 text-gray-400 hover:text-gray-200 
                                     cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-h-[90vh] 
                                overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className='m-0'>
            Update Due Diligence for {item.base.symbol}
          </DialogTitle>
          <DialogDescription>
            Edit the due diligence information for this asset pair.
          </DialogDescription>
        </DialogHeader>
        <DueDiligenceQuestionnaire
          onAnswersChange={handleAnswersUpdate}
          previousAnswers={item.DueDiligence}
          isModalOpen={isDialogOpen}
        />
        <div className="bg-gray-800 pt-4 pb-2 flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <XMarkIcon className="h-5 w-5 mr-1" />
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleUpdateConfirmation}
            disabled={updateLoading}
            className={
              `flex items-center justify-center space-x-2 ${updateLoading
                ? 'cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-800'
                : 'bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-800'}
                      w-full sm:w-auto`
            }
          >
            {updateLoading ? (
              <>
                <span>Updating...</span>
                <TbFidgetSpinner className="h-5 w-5 animate-spin" />
              </>
            ) : (
              <>
                <Save strokeWidth={1.25} className="h-5 w-5" />
                <span>Update</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}