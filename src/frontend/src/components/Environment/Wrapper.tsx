import { FC, PropsWithChildren } from 'react'
import {
  AgentProvider
} from '@ic-reactor/react'

// This component is responsible for determining the environment that the app is running in.
export const EnvironmentWrapper: FC<PropsWithChildren> = (props) => {
  const { children } = props
  const isLocal = window.location.hostname.includes('localhost')
  if (isLocal) {
    return (
      <AgentProvider withLocalEnv port={8000}>
        {children}
      </AgentProvider>
    )
  }
  return (
    <AgentProvider>
      {children}
    </AgentProvider>
  )
}