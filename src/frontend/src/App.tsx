import {
  RouterProvider,
} from "react-router-dom"
import { router } from './Routes/index.tsx'
import { PositionProvider } from "./Contexts/Position"
import { AssetPairProvider } from "./Contexts/AssetPair"
import { TradesProvider } from "./Contexts/Trade/index.tsx"
import { DisplayProvider } from "./Contexts/Display/index.tsx"
import { PriceProxyProvider } from "./Providers/PriceProxy/index.tsx"

// TODO: Find an elegant way to handle all of these nested context providers.
const App = () => {
  return (
    <AssetPairProvider>
      <PositionProvider>
        <TradesProvider>
          <DisplayProvider>
            <PriceProxyProvider>
              <RouterProvider router={router} />
            </PriceProxyProvider>
          </DisplayProvider>
        </TradesProvider>
      </PositionProvider>
    </AssetPairProvider>
  )
}

export default App
