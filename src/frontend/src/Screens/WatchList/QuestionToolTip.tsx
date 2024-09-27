import { FC } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

interface QuestionTooltipProps {
  content: string
  isOpen: boolean
}

export const QuestionTooltip: FC<QuestionTooltipProps> = ({ content, isOpen }) => {
  return (
    <TooltipProvider>
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-gray-500 mt-1 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="start"
          className="max-w-xs w-full border-2 border-gray-700 bg-gray-800 text-white z-50"
        >
          <p className="break-words">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}