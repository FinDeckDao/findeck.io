import { FC } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TbFidgetSpinner } from "react-icons/tb"


// Child component
interface CreateTradeModalProps {
  openClose: boolean
  toggleOpenClose: (open: boolean) => void
}

export const CreateTradeModal: FC<CreateTradeModalProps> = (props) => {
  const { openClose, toggleOpenClose } = props

  const updateLoading = false

  return (
    <Dialog open={openClose} onOpenChange={toggleOpenClose}>
      <DialogContent
        className="bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className='m-0'>
            Create Trade
          </DialogTitle>
          <DialogDescription>
            Enter the details of the trade you would like to create.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-800 pt-4 pb-2 flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => toggleOpenClose(false)}
            className="bg-blue-400 hover:bg-blue-500 text-white w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => { }}
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
                <span>Update</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog >
  )
}