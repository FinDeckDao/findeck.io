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
import { AssetPair, Answer } from '../../../../declarations/backend/backend.did'
import { Button } from "@/components/ui/button"
import { TbFidgetSpinner } from "react-icons/tb"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { Save } from 'lucide-react'

interface EditAssetPairProps {
  pair: AssetPair
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleAnswersUpdate: (answers: Answer[]) => void
  handleUpdateConfirmation: () => void
  updateLoading: boolean
}

export const EditAssetPair: FC<EditAssetPairProps> = (props) => {
  const {
    pair,
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
            Update Due Diligence for {pair.base.symbol}/{pair.quote.symbol}
          </DialogTitle>
          <DialogDescription>
            Edit the due diligence information for this asset pair.
          </DialogDescription>
        </DialogHeader>
        <DueDiligenceQuestionnaire
          onAnswersChange={handleAnswersUpdate}
          previousAnswers={pair.DueDiligence}
          isModalOpen={isDialogOpen}
        />
        <div className="bg-gray-800 pt-4 pb-2 flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="bg-blue-400 hover:bg-blue-500 text-white w-full sm:w-auto"
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
                ? 'cursor-not-allowed bg-blue-400 hover:bg-blue-500 text-white'
                : 'bg-blue-400 hover:bg-blue-500 text-white'}
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