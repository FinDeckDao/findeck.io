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
  QueueListIcon
} from "@heroicons/react/24/outline"
import { TradesScreen } from '../Screens/Trades'
import { Authenticate } from "@/Components/Authenticate"
import { ProfileScreen } from "@/Screens/Profile"
import { Wishlist } from "@/Screens/Wishlist"
import MoonBagCalculator from "@/Components/MoonBag/index.tsx"

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
  { name: 'Wishlist', href: '/wishlist', icon: <QueueListIcon className="h-6 w-6 inline" /> },
  { name: 'Trades', href: '/trades', icon: <ArrowsRightLeftIcon className="h-6 w-6 inline" /> },
  { name: 'Positions', href: '/positions', icon: <MapPinIcon className="h-6 w-6 inline" /> },
  // {
  //   name: 'Resources', href: '/resources'
  // },
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
        <Authenticate>
          <TradesScreen />
        </Authenticate>
      </DefaultLayout>
    )
  },
  {
    path: '/profile',
    element: (
      <DefaultLayout>
        <Authenticate>
          <ProfileScreen />
        </Authenticate>
      </DefaultLayout>
    )
  },
  {
    path: "/wishlist",
    element: (
      <DefaultLayout>
        <Authenticate>
          <Wishlist />
        </Authenticate>
      </DefaultLayout>
    )
  },
  {
    path: "/moonbag",
    element: (
      <DefaultLayout>
        <MoonBagCalculator initialBaseAmount={1} initialQuoteAmount={0.5} currentPrice={0.5} />
      </DefaultLayout>
    )
  }
])