import { useState, useEffect, FC } from 'react'
import { useQueryCall } from '@ic-reactor/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { InfoIcon } from 'lucide-react'

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
      const defaultAnswers = questions.map(() => ({ No: null }))
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
    <div className="space-y-6">
      {
        questions
          ? questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <span>{q.question}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{q.hint}</p>
                    </TooltipContent>
                  </Tooltip>
                  <ToggleGroup
                    type="single"
                    value={answers[index] ? (Object.keys(answers[index])[0].toLowerCase()) : undefined}
                    onValueChange={(value) => handleAnswerChange(index, value)}
                    className="flex space-x-4"
                  >
                    <ToggleGroupItem value="yes" className="w-16">Yes</ToggleGroupItem>
                    <ToggleGroupItem value="no" className="w-16">No</ToggleGroupItem>
                  </ToggleGroup>
                </TooltipProvider>
              </div>
            </div>
          ))
          : null
      }
    </div>
  )
}

export default DueDiligenceQuestionnaire