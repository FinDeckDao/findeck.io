import {
  RouterProvider,
} from "react-router-dom"
import { router } from './Routes/index.tsx'
import { PositionProvider } from "./Contexts/Position"
import { AssetPairProvider } from "./Contexts/AssetPair"
import { TradesProvider } from "./Contexts/Trade/index.tsx"
import { DisplayProvider } from "./Contexts/Display/index.tsx"

const App = () => {
  return (
    <AssetPairProvider>
      <PositionProvider>
        <TradesProvider>
          <DisplayProvider>
            <RouterProvider router={router} />
          </DisplayProvider>
        </TradesProvider>
      </PositionProvider>
    </AssetPairProvider>
  )
}

export default App
