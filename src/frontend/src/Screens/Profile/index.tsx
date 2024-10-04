import { FC } from 'react'
import { ContentWrapper } from './ContentWrapper'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { getValidTheme, getValidRole } from './utils'
import { hasKey } from '../../lib/utils'
import { Profile } from '../../../../declarations/backend/backend.did'
import { ProfileForm } from './Form'
import { useAuthState } from '@ic-reactor/react'
import { useBackendQueryCall, useBackendUpdateCall } from '@/Providers/backend'

// There are 3 conditions that a user profile can be in:
// 1. The user has a profile and the data is returned.
//   a. Display it here.
// 2. The user doesn't have a profile.
//   a. Display the createProfile component.
// 3. The profile needs to be edited.
//   a. Display the editProfile component.

// Component is responsible for displaying the user's profile information if it exists.
// If it doesn't exist then this component will display the createProfile component.
export const ProfileScreen: FC = () => {
  const { identity } = useAuthState()

  // This gets called as soon as use the data variable.
  // No need to explicitly call it.
  const { call: getProfile, data, loading, error } = useBackendQueryCall({
    functionName: 'getProfile',
    onError: (error) => {
      console.log("Error loading profile data: ", error)
    }
  }) as {
    call: () => void,
    data: { "ok": Profile } | { "err": string },
    loading: boolean,
    error: Error
  }

  // This gets passed to the ProfileForm component.
  // It gets called when the user submits the form.
  const {
    call: createProfile,
    loading: createLoading,
    error: createError
  } = useBackendUpdateCall({
    functionName: 'createProfile',
    onSuccess: () => {
      getProfile()
    },
    onError: (error) => {
      console.log("Error creating profile: ", error)
    }
  }) as {
    call: () => void
    loading: boolean
    error: Error
  }

  const {
    call: updateProfile,
    loading: updateLoading,
    error: updateError
  } = useBackendUpdateCall({
    functionName: 'updateProfile',
    onSuccess: () => {
      getProfile()
    },
    onError: (error) => {
      console.log("Error creating profile: ", error)
    }
  }) as {
    call: () => void
    loading: boolean
    error: Error
  }

  // Guards for expected failures and loading states.
  if (!identity) return <ContentWrapper>You need to be logged in to view this page.</ContentWrapper>
  if (error) return <ContentWrapper>Error: {error ? error.message : null}</ContentWrapper>
  if (loading) return <ContentWrapper>Loading...</ContentWrapper>

  // An error is returned so the user doesn't have a profile.
  if (hasKey(data, 'err')) {
    return (
      <ContentWrapper>
        <h1 className='text-2xl'>Create Your Member Profile</h1>
        <div className="rounded-md bg-yellow-50 m-4 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon aria-hidden="true" className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Please fill out your profile information and click "Save Changes" below.
                </p>
                <p>
                  This information helps us to customize your experience and to provide you with
                  calculations that more closely match what you need.
                </p>
              </div>
            </div>
          </div>
        </div>
        <ProfileForm
          userName=""
          shortTerm="0.2"
          longTerm="0.3"
          theme="System"
          role="Member"
          loading={createLoading}
          error={createError ? createError.message : "There was an error creating your profile."}
          saveProfile={createProfile}
        />
      </ContentWrapper>
    )
  }

  // Data is returned and the user has a profile.
  return (
    <ContentWrapper>
      <h1 className='text-2xl'>Your Member Profile</h1>
      <ProfileForm
        userName={hasKey(data, "ok") ? data.ok.name : ""}
        shortTerm={hasKey(data, "ok") ? String(data.ok.capitalGainsTaxRate.shortTerm) : ""}
        longTerm={hasKey(data, "ok") ? String(data.ok.capitalGainsTaxRate.longTerm) : ""}
        theme={hasKey(data, "ok") ? getValidTheme(Object.keys(data.ok.theme)[0]) : "System"}
        role={hasKey(data, "ok") ? getValidRole(Object.keys(data.ok.role)[0]) : "Member"}
        loading={updateLoading}
        error={updateError ? updateError.message : "There was an error updating your profile."}
        saveProfile={updateProfile}
      />
    </ContentWrapper>
  )
}