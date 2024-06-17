import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout/index.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'
import { Home } from '../Screens/Home'
import { DashboardScreen } from "../Screens/Dashboard"
import { PositionsScreen } from "../Screens/Positions"
import { ResourcesScreen } from "../Screens/Resources"
import { ProtectedContent } from "../Components/Auth/index.tsx"
import {
  //RectangleGroupIcon,
  MapPinIcon,
  HomeIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"
import { TradesScreen } from '../Screens/Trades'

interface NavigationItem {
  name: string
  href: string
  icon?: JSX.Element
}

export const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', icon: <HomeIcon className="h-6 w-6 inline" /> },
  // {
  //   name: 'Dashboard',
  //   href: '/dashboard',
  //   icon: <RectangleGroupIcon className="h-6 w-6 inline" />
  // },
  { name: 'Positions', href: '/positions', icon: <MapPinIcon className="h-6 w-6 inline" /> },
  // {
  //   name: 'Resources', href: '/resources'
  // },
  { name: 'Trades', href: '/trades', icon: <ArrowsRightLeftIcon className="h-6 w-6 inline" /> },
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
    ),
    errorElement: <ErrorPage />
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
  },
  {
    path: '/trades',
    element: (
      <DefaultLayout>
        <TradesScreen />
      </DefaultLayout>
    )
  }

])