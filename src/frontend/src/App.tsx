import {
  RouterProvider,
} from "react-router-dom"
import { router } from './Routes/index.tsx'
import { PositionProvider } from "./Contexts/Position/index.tsx"

const App = () => {
  return (
    <PositionProvider>
      <RouterProvider router={router} />
    </PositionProvider>
  )
}

export default App
