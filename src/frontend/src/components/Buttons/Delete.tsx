import { FC } from "react"
import { TrashIcon } from "@heroicons/react/24/outline"

interface DeleteButtonProps {
  onClick: () => void
  className?: string
}

export const DeleteButton: FC<DeleteButtonProps> = (props) => {
  const { onClick, className } = props
  return (
    <button className={`btn btn-warning btn-outline uppercase ${className}`}
      onClick={onClick}>
      <TrashIcon className="h-6 w-6 inline" />
      Delete
    </button>
  )
}