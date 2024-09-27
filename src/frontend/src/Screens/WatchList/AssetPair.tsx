import { FC, useState } from 'react'
import { AssetPair, Answer } from '../../../../declarations/backend/backend.did'
import { useUpdateCall } from '@ic-reactor/react'
import { DeleteGuard } from './DeleteGuard'
import { ResponsiveAssetPair } from './ResponsiveAssetPair'
import { EditAssetPair } from './EditAssetPair'

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
          <EditAssetPair
            pair={pair}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleAnswersUpdate={handleAnswersUpdate}
            handleUpdateConfirmation={handleUpdateConfirmation}
            updateLoading={updateLoading}
          />

          <DeleteGuard
            pair={pair}
            handleDeleteConfirmation={handleDeleteConfirmation}
          />
        </div>
      )}
    </div>
  )
}