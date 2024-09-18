import { ContentWrapper } from './ContentWrapper'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { FC, useState } from 'react'
import { hasKey } from '../../lib/utils'
import {
  Profile,
  Role,
  Theme,
} from '../../../../declarations/backend/backend.did'
import { useAuthState, useUpdateCall } from '@ic-reactor/react'
import { useNavigate } from 'react-router-dom'
import { ThemeVariant, getThemeVariant, getRoleVariant } from './utils'

export const CreateProfile: FC = () => {

  const navigate = useNavigate()
  const { identity } = useAuthState()
  const [name, setName] = useState<string>('')
  const [shortTerm, setShortTerm] = useState<string>("30")
  const [longTerm, setLongTerm] = useState<string>("20")
  const [theme, setTheme] = useState<ThemeVariant>("System")

  // Navigate to profile screen.
  const redirectToProfile = () => {
    navigate('/profile')
  }

  // {
  //   name: "Jay",
  //   role: { Member: null }, // Members can't change their role. A Dao Vote is required.
  //   capitalGainsTaxRate: { longTerm: Number(0.2), shortTerm: Number(0.3) },
  //   theme: theme || { System: null }
  // } as Profile

  const { call, loading } = useUpdateCall({
    functionName: 'createProfile',
    onSuccess: (result) => {
      // Created data is returned when the profile is created.
      if (hasKey(result, 'ok')) {
        redirectToProfile()
      }
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }



  // Guard for known failure states.
  if (!identity) return <ContentWrapper>You need to be logged in to view this page.</ContentWrapper>

  return (
    <ContentWrapper>
      <h1 className='text-2xl'>Profile Screen</h1>
      <div className="rounded-md bg-yellow-50 p-4 m-4 text-left">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon aria-hidden="true" className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Please fill out your profile information. Some items can't be changed by you manually.
                When you're done click the "Update Profile" button.
              </p>
              <p>
                This information helps us to customize your experience and to provide you with
                calculations that more closely match what you need.
              </p>
            </div>
          </div>
        </div>
      </div>
      <form className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="mb-1 sm:mb-0 sm:w-2/6 sm:text-right sm:pr-2">Internet Identity:</label>
          <input
            id="name"
            className="w-full sm:w-3/4 rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 text-sm leading-6"
            value={identity.getPrincipal().toString()}
            disabled
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label htmlFor="name" className="mb-1 sm:mb-0 sm:w-2/6 sm:text-right sm:pr-2 font-extrabold">
            Name:
          </label>
          <input
            id="name"
            className="w-full sm:w-3/4 rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 text-sm leading-6"
            value={name}
            onChange={updateName}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label htmlFor="theme" className="mb-1 sm:mb-0 sm:w-2/6 sm:text-right sm:pr-2 font-extrabold">
            Preferred Theme:
          </label>
          <select
            id="theme"
            className="w-full sm:w-3/4 rounded-md border-0 p-2 text-white bg-gray-700 shadow-sm ring-1
                      ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                      text-sm leading-6"
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeVariant)}
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="System">System</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label htmlFor="longTerm" className="mb-1 sm:mb-0 sm:w-2/6 sm:text-right sm:pr-2 font-extrabold">
            Long Term Capital Gains %:
          </label>
          <input
            id="longTerm"
            className="w-full sm:w-3/4 rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                    focus:ring-indigo-600 text-sm leading-6"
            value={longTerm}
            onChange={(e) => setLongTerm(e.target.value)}
            type='number'
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label htmlFor="shortTerm" className="mb-1 sm:mb-0 sm:w-2/6 sm:text-right sm:pr-2 font-extrabold">
            Short Term Capital Gains %:
          </label>
          <input
            id="shortTerm"
            className="w-full sm:w-3/4 rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                    focus:ring-indigo-600 text-sm leading-6"
            value={shortTerm}
            onChange={(e) => setShortTerm(e.target.value)}
            type="number"
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              const themeObject: Theme = getThemeVariant(theme)
              // Static value set for the role because the UI doesn't control this the DAO does.
              const roleObject: Role = getRoleVariant("Member")

              const profile: Profile = {
                name: name,
                theme: themeObject,
                role: roleObject,
                capitalGainsTaxRate: {
                  longTerm: Number(longTerm),
                  shortTerm: Number(shortTerm)
                }
              }
              call([profile])
            }
            }
          >
            {loading ? "Creating Profile..." : "Create Profile"}
          </button>
        </div>
      </form>
    </ContentWrapper>
  )
}