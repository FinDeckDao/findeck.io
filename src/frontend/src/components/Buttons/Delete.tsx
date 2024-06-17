import { FC } from "react"
import { TrashIcon } from "@heroicons/react/24/outline"

interface DeleteButtonProps {
  onClick: () => void
}

export const DeleteButton: FC<DeleteButtonProps> = (props) => {
  const { onClick } = props
  return (
    <button className="btn btn-warning btn-outline uppercase"
      onClick={onClick}>
      <TrashIcon className="h-6 w-6 inline" />
      Delete
    </button>
  )
}