import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useAuthState, useQueryCall, useUpdateCall } from '@ic-reactor/react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { Profile } from '../../../../declarations/backend/backend.did'

const ContentWrapper: FC<PropsWithChildren> = (props) => {
  const { children } = props
  return (
    <div className='container pt-4 mx-auto items-center justify-center text-center rounded-3xl bg-dark'>
      {children}
    </div>
  )
}

export const ProfileScreen: FC = () => {
  const { identity } = useAuthState()
  const [name, setName] = useState<string>('')
  const [role, setRole] = useState<string>('Member')
  const [longTerm, setLongTerm] = useState<number>(0)
  const [shortTerm, setShortTerm] = useState<number>(0)
  const [theme, setTheme] = useState<string>('')

  const { data, loading, error } = useQueryCall({
    functionName: 'getProfile',
  }) as {
    data: { "ok": Profile } | { "err": string } | null,
    loading: boolean,
    error: Error
  }

  const { data: createData, loading: createLoading, error: createError } = useUpdateCall({
    functionName: 'createProfile',
    args: [{ name, role, capitalGainsTaxRate: { longTerm, shortTerm }, theme }]
  }) as {
    data: { "ok": Profile } | { "err": string } | null,
    loading: boolean,
    error: Error
  }

  useEffect(() => {
    // Created data is returned when the profile is created.
    if (createData && "ok" in createData) {
      setName(createData.ok.name)
      setRole(createData.ok.role.toString())
      setLongTerm(createData.ok.capitalGainsTaxRate.longTerm)
      setShortTerm(createData.ok.capitalGainsTaxRate.shortTerm)
      setTheme(createData.ok.theme.toString())
    }

    // Data is returned when the profile is fetched.
    // If an empty data set is returned then this won't run.
    if (data && "ok" in data) {
      setName(data.ok.name)
      setRole(data.ok.role.toString())
      setLongTerm(data.ok.capitalGainsTaxRate.longTerm)
      setShortTerm(data.ok.capitalGainsTaxRate.shortTerm)
      setTheme(data.ok.theme.toString())
    }

  }, [data, createData])

  const updateName = (element: React.ChangeEvent<HTMLInputElement>) => {
    setName(element.target.value)
  }

  // Guards for expected failures and loading states.
  if (!identity) return <ContentWrapper>You need to be logged in to view this page.</ContentWrapper>
  if (error || createError) return <ContentWrapper>Error: {error ? error.message : createError ? createError.message : null}</ContentWrapper>
  if (loading) return <ContentWrapper>Loading...</ContentWrapper>

  const getNotice = () => {
    // We have the data but the name is not set.
    if (data && "ok" in data) {
      if (!data.ok.name || !data.ok.role || !data.ok.capitalGainsTaxRate || !data.ok.theme) {
        return (
          <div className="rounded-md bg-yellow-50 p-4 ml-20">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon aria-hidden="true" className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please fill out your profile information and click "Update Profile" below.
                    This information helps us to customize your experience and to provide you with
                    calculations that more closely match what you need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  const handleUpdateProfile = async () => { }

  return (
    <ContentWrapper>
      <h1 className='text-2xl'>Profile Screen</h1>
      {getNotice()}
      <form>
        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="text-right pr-2 py-2 w-2/6">Internet Identity:</td>
              <td className="text-left py-2 w-3/4">{identity.getPrincipal().toString()}</td>
            </tr>
            <tr>
              <td className="text-right pr-2 py-2 w-2/6">
                <span className="font-extrabold">Name:</span>
              </td>
              <td className="py-2 w-3/4">
                <input
                  className="block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={name} onChange={updateName}
                />
              </td>
            </tr>
            <tr>
              <td className="text-right pr-2 py-2 w-2/6">
                <span className="font-extrabold">Role:</span>
              </td>
              <td className="py-2 w-3/4">
                <input
                  className="block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={role}
                />
              </td>
            </tr>
            <tr>
              <td className="text-right pr-2 py-2 w-2/6">
                <span className="font-extrabold">Preferred Theme (change to dropdown):</span>
              </td>
              <td className="py-2 w-3/4">
                <input
                  className="block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={theme}
                />
              </td>
            </tr>
            <tr>
              <td className="text-right pr-2 py-2 w-2/6">
                <span className="font-extrabold">Long Term Capital Gains:</span>
              </td>
              <td className="py-2 w-3/4">
                <input className="block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={longTerm}
                />
              </td>
            </tr>
            <tr>
              <td className="text-right pr-2 py-2 w-2/6">
                <span className="font-extrabold">Short Term Capital Gains:</span>
              </td>
              <td className="py-2 w-3/4">
                <input
                  className="block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={shortTerm}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleUpdateProfile}>
            {createLoading ? "Updating Profile..." : "Update Profile"}
          </button>
        </div>

      </form>
    </ContentWrapper>
  )
}