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
import {
  idlFactory as tradeManagerIdlFactory,
  canisterId as tradeManagerCanisterId
} from '../../declarations/trade_manager'
import {
  idlFactory as wishlistManagerIdlFactory,
  canisterId as wishlistManagerCanisterId
} from '../../declarations/wishlist_manager'
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
        <ActorProvider idlFactory={tradeManagerIdlFactory}
          canisterId={tradeManagerCanisterId}
          errorComponent={() => (
            <ErrorPage
              errorMessage=""
            />
          )}>
          <ActorProvider idlFactory={wishlistManagerIdlFactory}
            canisterId={wishlistManagerCanisterId}
            errorComponent={() => (
              <ErrorPage
                errorMessage=""
              />
            )}>
            <App />
          </ActorProvider>
        </ActorProvider>
      </ActorProvider>
    </EnvironmentWrapper>
  </StrictMode>
)