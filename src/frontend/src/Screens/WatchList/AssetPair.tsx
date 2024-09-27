import { FC, useState } from 'react'
import { XCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { AssetPair, Answer } from '../../../../declarations/backend/backend.did'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DueDiligenceQuestionnaire } from './Questionnaire'
import { Button } from "@/components/ui/button"
import { Save } from 'lucide-react'
import { TbFidgetSpinner } from "react-icons/tb"

interface ResponsiveAssetPairProps {
  pair: AssetPair
  yesAnswersCount: number
}

const ResponsiveAssetPair: FC<ResponsiveAssetPairProps> = (props) => {
  const { pair, yesAnswersCount } = props
  return (
    <div className="flex flex-wrap items-center gap-2" >
      <div className="flex items-center space-x-2 flex-grow min-w-0">
        <img src={pair.base.img_url} alt={pair.base.name} className="w-10 h-10" />
        <img src={pair.quote.img_url} alt={pair.quote.name} className="w-10 h-10" />
        <span className="truncate">{pair.base.symbol}</span>
        <span>/</span>
        <span className="truncate">{pair.quote.symbol}</span>
      </div>
      <div className="flex items-center w-full sm:w-auto">
        <div className="relative inline-flex h-5">
          {[...Array(yesAnswersCount)].map((_, i) => (
            <StarIcon
              key={i}
              className="h-5 w-5 text-yellow-400 absolute"
              style={{ left: `${i * 18}px`, top: '50%', transform: 'translateY(-50%)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface WatchedAssetPairProps {
  pair: AssetPair
  index: number
  onDelete?: (pair: AssetPair) => void
  onUpdate?: () => void
}

export const WatchedAssetPair: FC<WatchedAssetPairProps> = (props) => {
  const { pair, index, onDelete, onUpdate } = props
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatedAnswers, setUpdatedAnswers] = useState(pair.DueDiligence)

  const { call: removeWatchedAsset } = useUpdateCall({
    functionName: "deleteWatchListItem"
  })

  const { call: updateWatchListItem, loading: updateLoading } = useUpdateCall({
    functionName: "createWatchListItem",
    onSuccess: () => {
      setIsDialogOpen(false)
      if (onUpdate) {
        onUpdate()
      }
    }
  })

  const handleDeleteConfirmation = (pair: AssetPair) => {
    if (onDelete) {
      removeWatchedAsset([pair])
      onDelete(pair)
    }
  }

  const handleUpdateConfirmation = () => {
    const updatedPair = { ...pair, DueDiligence: updatedAnswers }
    updateWatchListItem([updatedPair])
  }

  const handleAnswersUpdate = (answers: Answer[]) => {
    setUpdatedAnswers(answers)
  }

  const yesAnswersCount = pair.DueDiligence.filter(answer => 'Yes' in answer).length

  return (
    <div
      key={`${index}-${pair.base.symbol}-${pair.quote.symbol}`}
      className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded-2xl text-white 
                border border-gray-700"
    >
      <ResponsiveAssetPair pair={pair} yesAnswersCount={yesAnswersCount} />

      {onDelete && (
        <div className="flex items-center space-x-2">
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
                  onClick={() => handleDeleteConfirmation(pair)}>
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}