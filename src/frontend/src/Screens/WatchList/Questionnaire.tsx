import { useState, useEffect, FC } from 'react'
import { useQueryCall } from '@ic-reactor/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'
import { AnswerSwitch } from './AnswerSwitch'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { Question } from '../../../../declarations/backend/backend.did'

interface ResponsiveTooltipProps {
  content: string
  isOpen: boolean
}

const ResponsiveTooltip: FC<ResponsiveTooltipProps> = ({ content, isOpen }) => {
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

type Answer = { Yes: null } | { No: null }

interface DueDiligenceQuestionnaireProps {
  onAnswersChange: (answers: Answer[]) => void
  previousAnswers?: Answer[]
  isModalOpen: boolean
}

export const DueDiligenceQuestionnaire: FC<DueDiligenceQuestionnaireProps> = (props) => {
  const { onAnswersChange, previousAnswers, isModalOpen } = props
  const { data: questions, loading, error } = useQueryCall({
    functionName: 'getDueDiligenceQuestions',
  }) as { data: Question[], loading: boolean, error: Error | null }

  const [answers, setAnswers] = useState<Answer[]>([])
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null)

  // Effect to update parent component when answers change
  useEffect(() => {
    onAnswersChange(answers)
  }, [answers, onAnswersChange])

  // Initialize answers
  useEffect(() => {
    if (questions && questions.length > 0) {
      const sortedQuestions = questions.sort((a, b) => a.question.length - b.question.length)

      if (previousAnswers && previousAnswers.length === sortedQuestions.length) {
        setAnswers(previousAnswers)
      } else {
        const defaultAnswers = sortedQuestions.map(() => ({ No: null }))
        setAnswers(defaultAnswers)
      }
    }
  }, [questions, previousAnswers])

  // Reset tooltip state when modal opens or closes
  useEffect(() => {
    setOpenTooltipIndex(null)
  }, [isModalOpen])

  // Guard for common failures.
  if (loading) return <div>Loading questions...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!questions) return <div>Sorry, no questions were found.</div>

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prevAnswers: Answer[]) => {
      const newAnswers = [...prevAnswers]
      newAnswers[index] = value === 'yes' ? { Yes: null } : { No: null }
      return newAnswers
    })
  }

  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto">
      <div className="rounded-2xl bg-blue-950 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon aria-hidden="true" className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3 md:justify-between">
            <p className="text-sm text-blue-400">
              <span>Answering these questions is optional:</span>
              <br /><br />
              Hold your mouse over the info icon on the left of the question for more details.
              If you have opinions regarding the answers to these questions answering helps everyone who uses this dApp.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 container">
        {questions.map((q, index) => (
          <div key={`${index}-${q.id}`} className="space-y-2 bg-gray-800 border-2 border-gray-700 p-2 rounded-2xl">
            <div className="flex items-start space-x-2">
              <div
                onMouseEnter={() => setOpenTooltipIndex(index)}
                onMouseLeave={() => setOpenTooltipIndex(null)}
              >
                <ResponsiveTooltip
                  content={q.hint}
                  isOpen={openTooltipIndex === index}
                />
              </div>
              <span className="flex-grow">{q.question}</span>
              <AnswerSwitch
                index={index}
                handleAnswerChange={handleAnswerChange}
                initialAnswer={answers[index]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DueDiligenceQuestionnaire