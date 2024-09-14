import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout/index.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'
// import { Home } from '../Screens/Home'
import { ComingSoon } from '../Screens/Home/ComingSoon'
import { DashboardScreen } from "../Screens/Dashboard"
import { PositionsScreen } from "../Screens/Positions"
import { ResourcesScreen } from "../Screens/Resources"
import {
  //RectangleGroupIcon,
  MapPinIcon,
  HomeIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"
import { TradesScreen } from '../Screens/Trades'
import { Authenticate } from "../Components/Authenticate/index.tsx"

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
        <ComingSoon />
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  },
  // Positions screen is protected by the AuthContext.
  {
    path: "/positions",
    element: (
      <DefaultLayout>
        <Authenticate>
          <PositionsScreen />
        </Authenticate>
      </DefaultLayout >
    ),
    errorElement: <ErrorPage />
  },
  // Dashboard screen is protected by the AuthContext.
  {
    path: "/dashboard",
    element: (
      <DefaultLayout>
        <Authenticate>
          <DashboardScreen />
        </Authenticate>
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