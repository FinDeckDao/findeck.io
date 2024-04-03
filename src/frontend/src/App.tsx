import {
  RouterProvider,
} from "react-router-dom"
import { router } from './Routes/index.tsx'

const App = () => {
  return <RouterProvider router={router} />
}

export default App
