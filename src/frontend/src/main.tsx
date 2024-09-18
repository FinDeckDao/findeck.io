import './Styles/index.css'
import { StrictMode } from 'react'
import App from './App'
import ReactDOM from 'react-dom/client'
import {
  ActorProvider,
} from '@ic-reactor/react'
import {
  idlFactory as backendIdlFactory,
  canisterId as backendCanisterId
} from '../../declarations/backend'
import { ErrorPage } from './Components/Error'
import { EnvironmentWrapper } from './Components/Environment/Wrapper'

// This is the root element that the React app will be mounted to
const root = document.getElementById('root')

// Render the React app
ReactDOM.createRoot(root!).render(
  <StrictMode>
    <EnvironmentWrapper>
      <ActorProvider idlFactory={backendIdlFactory}
        canisterId={backendCanisterId}
        errorComponent={() => (
          <ErrorPage
            errorMessage=""
          />
        )}>
        <App />
      </ActorProvider>
    </EnvironmentWrapper>
  </StrictMode>
)