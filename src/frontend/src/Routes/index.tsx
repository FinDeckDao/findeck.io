import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout/index.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'
import { Home } from '../Screens/Home'
import { DashboardScreen } from "../Screens/Dashboard"
import { PositionsScreen } from "../Screens/Positions"
import { ResourcesScreen } from "../Screens/Resources"
import { ProtectedContent } from "../components/Auth/index.tsx"

export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Positions', href: '/positions' },
  { name: 'Resources', href: '/resources' },
]

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  },
  // Positions screen is protected by the AuthContext.
  {
    path: "/positions",
    element: (
      <DefaultLayout>
        <ProtectedContent>
          <PositionsScreen />
        </ProtectedContent>
      </DefaultLayout>
    )
  },
  // Dashboard screen is protected by the AuthContext.
  {
    path: "/dashboard",
    element: (
      <DefaultLayout>
        <ProtectedContent>
          <DashboardScreen />
        </ProtectedContent>
      </DefaultLayout>
    )
  },
  {
    path: "/resources",
    element: (
      <DefaultLayout>
        <ResourcesScreen />
      </DefaultLayout>
    )
  }
])