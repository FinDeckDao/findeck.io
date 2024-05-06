import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]

type Price = { monthly: string, annually: string }
type tier = {
  name: string,
  id: string,
  href: string,
  price: Price,
  description: string,
  features: string[],
  mostPopular: boolean,
}

const tiers: tier[] = [
  {
    name: 'Free Trader',
    id: 'tier-free',
    href: '#',
    price: { monthly: '$0', annually: '$0' },
    description: 'Free To Use - Forever',
    features: [
      'Track Unlimited Trades',
      'Track Unlimited Positions',
      'Data Stored In Your Browser',
      'Manual Backups',
      'Manual Price Data Entry',
      'Share Your Trades'
    ],
    mostPopular: true,
  },
  {
    name: 'Profit Trader',
    id: 'tier-paid',
    href: '#',
    price: { monthly: '$10', annually: '$100' },
    description: 'This is helping you make profit',
    features: [
      'Track Unlimited Trades',
      'Track Unlimited Positions',
      'Data Stored On ICP Network',
      'Automatic Backups',
      'Automatic Price Data',
      'Share Your Trades'
    ],
    mostPopular: false,
  },
  {
    name: 'Sponsor Trader',
    id: 'tier-sponsor',
    href: '#',
    price: { monthly: '$20', annually: '$200' },
    description: 'You want to own this project',
    features: [
      'Track Unlimited Trades',
      'Track Unlimited Positions',
      'Data Stored On ICP Network',
      'Automatic Backups',
      'Automatic Price Data',
      'Share Your Trades',
      'Half Back In FNDK DAO Tokens',
    ],
    mostPopular: false,
  }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div className="bg-slate-800 p-8 rounded-3xl">
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"
          >
            <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  classNames(checked ? 'bg-indigo-500' : '', 'cursor-pointer rounded-full px-2.5 py-1')
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'bg-white/5 ring-2 ring-indigo-500' : 'ring-1 ring-white/10',
                'rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 id={tier.id} className="text-lg font-semibold leading-8 text-white">
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.price[frequency.value as keyof typeof tier.price]}</span>
                <span className="text-sm font-semibold leading-6 text-gray-300">{frequency.priceSuffix}</span>
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                    : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                  'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                )}
              >
                Buy plan
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}