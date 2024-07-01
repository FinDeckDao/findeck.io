import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './Styles/index.css'
import App from './App'

// This is the root element that the React app will be mounted to
const root = document.getElementById('root')

// Render the React app
ReactDOM.createRoot(root!).render(
  <StrictMode>
    <App />
  </StrictMode >,
)