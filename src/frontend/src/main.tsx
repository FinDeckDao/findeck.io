import './Styles/index.css'
import { StrictMode } from 'react'
import App from './App'
import ReactDOM from 'react-dom/client'
import {
  ActorProvider,
  AgentProvider
} from '@ic-reactor/react'
import {
  idlFactory as backendIdlFactory,
  canisterId as backendCanisterId
} from '../../declarations/backend'
import { ErrorPage } from './Components/Error'

// This is the root element that the React app will be mounted to
const root = document.getElementById('root')

// Render the React app
ReactDOM.createRoot(root!).render(
  <StrictMode>
    <AgentProvider withLocalEnv port={8000}>
      {/* <AgentProvider> // Production */}
      <ActorProvider idlFactory={backendIdlFactory}
        canisterId={backendCanisterId}
        errorComponent={() => (
          <ErrorPage
            errorMessage=""
          />
        )}>
        <App />
      </ActorProvider>
    </AgentProvider>
  </StrictMode >
)