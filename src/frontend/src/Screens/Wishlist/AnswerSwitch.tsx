import { FC, useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { Answer } from '../../../../declarations/wishlist_manager/wishlist_manager.did'

interface AnswerSwitchProps {
  index: number
  handleAnswerChange: (index: number, value: string) => void
  initialAnswer?: Answer
}

export const AnswerSwitch: FC<AnswerSwitchProps> = (props) => {
  const { index, handleAnswerChange, initialAnswer } = props
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    setToggle(initialAnswer ? 'Yes' in initialAnswer : false)
  }, [initialAnswer])

  const onChange = (checked: boolean) => {
    setToggle(checked)
    handleAnswerChange(index, checked ? 'yes' : 'no')
  }

  return (
    <Switch
      checked={toggle}
      onChange={onChange}
      className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
                rounded-full border-2 border-transparent transition-colors 
                duration-200 ease-in-out focus:outline-none focus:ring-2 
                focus:ring-lime-900 focus:ring-offset-2
                ${toggle ? 'bg-lime-900' : 'bg-red-900'}`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full
                  bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${toggle ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </Switch>
  )
}

export default AnswerSwitch