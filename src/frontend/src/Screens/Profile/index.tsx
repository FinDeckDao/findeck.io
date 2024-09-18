import {
  FC,
  //useState
} from 'react'
import { useAuthState, useQueryCall, useUpdateCall } from '@ic-reactor/react'
import { Profile } from '../../../../declarations/backend/backend.did'
import { ContentWrapper } from './ContentWrapper'
import { hasKey } from '../../lib/utils'
import { ProfileForm } from './Form'
import { getValidTheme, getValidRole } from './utils'

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
  const { call: getProfile, data, loading, error } = useQueryCall({
    functionName: 'getProfile',
    onSuccess: (data) => {
      if (hasKey(data, 'ok')) {
        console.log("Profile data: ", data.ok)
      }
      //console.log("Profile data loaded")
    },
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
  } = useUpdateCall({
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
  } = useUpdateCall({
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