import {
  RouterProvider,
} from "react-router-dom"
import { router } from './Routes/index.tsx'
import { PositionProvider } from "./Contexts/Position"
import { AssetPairProvider } from "./Contexts/AssetPair"

const App = () => {
  return (
    <PositionProvider>
      <AssetPairProvider>
        <RouterProvider router={router} />
      </AssetPairProvider>
    </PositionProvider>
  )
}

export default App
