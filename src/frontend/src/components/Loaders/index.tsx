import { Suspense, FC } from 'react'
import { TbFidgetSpinner } from "react-icons/tb"

interface LoaderWithExplanationProps {
  explanation: string
}

export const LoaderWithExplanation: FC<LoaderWithExplanationProps> = (props) => {
  const { explanation } = props
  return (
    <div className="flex items-center justify-center min-h-900">
      <div className="flex items-center gap-2">
        <span>{explanation}</span>
        <TbFidgetSpinner className="h-5 w-5 animate-spin" />
      </div>
    </div>
  )
}

interface LoadingWrapperProps {
  children: React.ReactNode
  loader?: React.ReactNode
}

export const LoadingWrapper: FC<LoadingWrapperProps> = (props) => {
  const { children, loader } = props
  return (
    <Suspense fallback={loader || <LoaderWithExplanation explanation="Loading..." />}>
      {children}
    </Suspense>
  )
}