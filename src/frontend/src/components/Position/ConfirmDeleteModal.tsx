import { XCircleIcon, CheckIcon } from "@heroicons/react/24/outline"

interface ConfirmDeleteModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
  deleteAction: () => void
}

export const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => {
  const { modalRef, deleteAction } = props

  const closeModal = () => {
    modalRef.current?.close()
  }

  return (
    <dialog className="modal" ref={modalRef} >
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in the dialog form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <XCircleIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </form>
        <h3 className="font-bold text-lg">Are you sure?</h3>
        <p>You're about to delete all trades for this position.</p>
        <div className='modal-action'>
          <button className="btn btn-warning btn-outline uppercase" onClick={deleteAction}>
            <CheckIcon className="h-6 w-6" aria-hidden="true" />
            Yes
          </button>
          <button className="btn btn-primary btn-outline uppercase" onClick={closeModal}>
            <XCircleIcon className="h-6 w-6" aria-hidden="true" />
            No
          </button>
        </div>
      </div>
    </dialog>
  )
}