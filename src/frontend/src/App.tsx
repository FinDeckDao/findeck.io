import {
  RouterProvider,
} from "react-router-dom"
import { router } from './Routes/index.tsx'
import { PositionProvider } from "./Contexts/Position"
import { AssetPairProvider } from "./Contexts/AssetPair"
import { TradesProvider } from "./Contexts/Trade/index.tsx"
import { DisplayProvider } from "./Contexts/Display/index.tsx"
import { PricesProvider } from "./Contexts/Price/index.tsx"

// TODO: Find an elegant way to handle all of these nested context providers.
const App = () => {
  return (
    <AssetPairProvider>
      <PositionProvider>
        <TradesProvider>
          <DisplayProvider>
            <PricesProvider>
              <RouterProvider router={router} />
            </PricesProvider>
          </DisplayProvider>
        </TradesProvider>
      </PositionProvider>
    </AssetPairProvider>
  )
}

export default App
