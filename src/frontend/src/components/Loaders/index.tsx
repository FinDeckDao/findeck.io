import { Suspense, FC } from 'react'
import { TbFidgetSpinner } from "react-icons/tb"

interface LoaderWithExplanationProps {
  explanation: string
  className?: string
  align?: 'left' | 'center' | 'right'
}

export const LoaderWithExplanation: FC<LoaderWithExplanationProps> = (props) => {
  const { explanation, className = '', align = 'center' } = props

  const justifyClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[align]

  return (
    <div className={`flex items-center ${justifyClass} min-h-900 ${className}`}>
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