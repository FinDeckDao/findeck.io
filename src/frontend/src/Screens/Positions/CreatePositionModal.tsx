
interface CreatePositionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
}

export const CreatePositionModal = (props: CreatePositionModalProps) => {
  const { modalRef } = props

  const closeModal = () => {
    modalRef.current?.close()
  }

  return (
    <dialog className="modal" ref={modalRef} >
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in the dialog form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">New Position</h3>
        <p className="py-4">Press ESC key or click on ✕ button to close</p>
        <div className='modal-action'>
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </dialog>
  )
}