import './Styles/index.css'
import { StrictMode } from 'react'
import App from './App'
import ReactDOM from 'react-dom/client'

import { ErrorPage } from './Components/Error'
import { EnvironmentBasedAgentProvider } from './Components/Environment/Wrapper'
import { BackendProvider } from './Providers/backend'
import { TradeManagerProvider } from './Providers/tradeManager'
import { WishlistManagerProvider } from './Providers/WishlistManager'

// This is the root element that the React app will be mounted to
const root = document.getElementById('root')

// Render the React app
ReactDOM.createRoot(root!).render(
  <StrictMode>
    {/*
      NOTE: AgentProvider is inside EnvironmentWrapper because the 
      environment determines what kind of agent is used. 
     */}
    <EnvironmentBasedAgentProvider>
      <BackendProvider errorComponent={() => (<ErrorPage errorMessage="" />)}>
        <TradeManagerProvider errorComponent={() => (<ErrorPage errorMessage="" />)}>
          <WishlistManagerProvider errorComponent={() => (<ErrorPage errorMessage="" />)}>
            <App />
          </WishlistManagerProvider>
        </TradeManagerProvider>
      </BackendProvider>
    </EnvironmentBasedAgentProvider>
  </StrictMode>
)