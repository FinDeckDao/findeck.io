import { FC, useState } from "react"
import { ContentWrapper } from "./ContentWrapper"
import { useAuthState, useUpdateCall } from '@ic-reactor/react'
import { hasKey } from "@/lib/utils"
import { Profile, Theme } from '../../../../declarations/backend/backend.did'
import { ThemeVariant, getThemeVariant, getRoleVariant } from "./utils"

interface EditProfileProps {
  name: string,
  shortTerm: string,
  longTerm: string,
  theme: ThemeVariant,
  role: string
}

export const EditProfile: FC<EditProfileProps> = (props) => {
  const {
    name: inputName,
    shortTerm: inputShortTerm,
    longTerm: inputLongTerm,
    theme: inputTheme,
  } = props

  const { identity } = useAuthState()
  const [name, setName] = useState<string>(inputName)
  const [shortTerm, setShortTerm] = useState<string>(inputShortTerm)
  const [longTerm, setLongTerm] = useState<string>(inputLongTerm)
  const [theme, setTheme] = useState<ThemeVariant>(inputTheme)

  const { call, loading } = useUpdateCall({
    functionName: 'createProfile',
    onSuccess: (result) => {
      if (hasKey(result, 'ok')) {
        // Do some type casting to get the profile object.
        const profile: Profile = result.ok as unknown as Profile
        setName(String(profile.name))
        setTheme(Object.keys(profile.theme)[0] as ThemeVariant)
      }
    },
    onError: (error) => {
      console.error(error)
    }
  })

  // Guard for known failure states.
  if (!identity) return <ContentWrapper>You need to be logged in to view this page.</ContentWrapper>

  return (
    <ContentWrapper>
      <h1 className='text-2xl'>Profile Screen</h1>
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
            onChange={(e) => setName(e.target.value)}
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