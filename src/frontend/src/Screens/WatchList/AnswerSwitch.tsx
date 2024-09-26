import { FC, useState } from 'react'
import { Switch } from '@headlessui/react'

interface AnswerSwitchProps {
  index: number
  handleAnswerChange: (index: number, value: string) => void
}

export const AnswerSwitch: FC<AnswerSwitchProps> = (props) => {
  const { index, handleAnswerChange } = props
  const [toggle, setToggle] = useState(false)

  return (
    <Switch
      checked={toggle}
      onChange={(value) => {
        console.log('Switch Value: ', value)
        console.log('Switch Evaluation: ', (value ? 'yes' : 'no'))
        handleAnswerChange(index, (value ? 'yes' : 'no'))
        console.log('Old Toggle Value: ', toggle)
        console.log('New Toggle Value: ', !toggle)
        setToggle(!toggle)
      }}
      className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
                rounded-full border-2 border-transparent bg-red-900 
                transition-colors duration-200 ease-in-out focus:outline-none 
                focus:ring-2 focus:ring-lime-900 focus:ring-offset-2 
                data-[checked]:bg-lime-900"
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full
                 bg-white shadow ring-0 transition duration-200 ease-in-out 
                 group-data-[checked]:translate-x-5"
      />
    </Switch>
  )
}

export default AnswerSwitch