import { useState, useEffect, FC } from 'react'
import { useQueryCall } from '@ic-reactor/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
//import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { InfoIcon } from 'lucide-react'
import { AnswerSwitch } from './AnswerSwitch'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

type Answer = { Yes: null } | { No: null }

interface DueDiligenceQuestionnaireProps {
  onAnswersChange: (answers: Answer[]) => void
}

interface Question {
  question: string
  hint: string
}

export const DueDiligenceQuestionnaire: FC<DueDiligenceQuestionnaireProps> = ({ onAnswersChange }) => {
  const { data: questions, loading, error } = useQueryCall({
    functionName: 'getDueDiligenceQuestions',
    onSuccess: (data) => {
      console.log('Received questions:', data)
    }
  }) as { data: Question[], loading: boolean, error: Error | null }

  const [answers, setAnswers] = useState<Answer[]>([])

  useEffect(() => {
    onAnswersChange(answers)
  }, [answers, onAnswersChange])

  useEffect(() => {
    if (questions && questions.length > 0) {
      const sortedQuestions = questions?.sort((a, b) => a.question.length - b.question.length) || []
      const defaultAnswers = sortedQuestions.map(() => ({ No: null }))
      setAnswers(defaultAnswers)
    }
  }, [questions])

  if (loading) return <div>Loading questions...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prevAnswers: Answer[]) => {
      const newAnswers = [...prevAnswers]
      newAnswers[index] = value === 'yes' ? { Yes: null } : { No: null }
      return newAnswers
    })
  }

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-md bg-blue-950 p-4">
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
      {
        questions
          ? questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{q.hint}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>{q.question}</span>
                <AnswerSwitch index={index} handleAnswerChange={handleAnswerChange} />
              </div>
            </div>
          ))
          : null
      }
    </div>
  )
}

export default DueDiligenceQuestionnaire