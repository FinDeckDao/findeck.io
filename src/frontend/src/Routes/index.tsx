
import {
  createBrowserRouter,
} from "react-router-dom"

import { DefaultLayout } from '../Layout/index.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'
import {
  ComingSoonScreen,
  DashboardScreen,
  PositionsScreen,
  ResourcesScreen
} from '../Components/LazyLoad'
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
import { MoonBagCalculator } from "@/Components/MoonBag"
import { SearchableFiatCurrencySelector } from "@/Components/Currency/SearchableFiatCurrencySelector"
import { LoaderWithExplanation, LoadingWrapper } from '@/Components/Loaders'

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
        <LoadingWrapper
          loader={<LoaderWithExplanation
            explanation='Loading Coming Soon Screen...'
          />}>
          <ComingSoonScreen />
        </LoadingWrapper>
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/positions",
    element: (
      <DefaultLayout>
        <Authenticate>
          <LoadingWrapper
            loader={<LoaderWithExplanation
              explanation='Loading Positions Screen...'
            />}>
            <PositionsScreen />
          </LoadingWrapper>
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
          <LoadingWrapper
            loader={<LoaderWithExplanation
              explanation='Loading Dashboard Screen...'
            />}>
            <DashboardScreen />
          </LoadingWrapper>
        </Authenticate>
      </DefaultLayout>
    )
  },
  {
    path: "/resources",
    element: (
      <DefaultLayout>
        <LoadingWrapper
          loader={<LoaderWithExplanation
            explanation='Loading Resources Screen...'
          />}>
          <ResourcesScreen />
        </LoadingWrapper>
      </DefaultLayout>
    )
  },
  {
    path: '/trades',
    element: (
      <DefaultLayout>
        <Authenticate>
          <LoadingWrapper
            loader={<LoaderWithExplanation
              explanation='Loading Trades Screen...'
            />}>
            <TradesScreen />
          </LoadingWrapper>
        </Authenticate>
      </DefaultLayout>
    )
  },
  {
    path: '/profile',
    element: (
      <DefaultLayout>
        <Authenticate>
          <LoadingWrapper
            loader={<LoaderWithExplanation
              explanation='Loading Profile Screen...'
            />}
          >
            <ProfileScreen />
          </LoadingWrapper>
        </Authenticate>
      </DefaultLayout>
    )
  },
  {
    path: "/wishlist",
    element: (
      <DefaultLayout>
        <Authenticate>
          <LoadingWrapper loader={<LoaderWithExplanation explanation='Loading Wishlist Screen...' />}>
            <Wishlist />
          </LoadingWrapper>
        </Authenticate>
      </DefaultLayout>
    )
  },
  {
    path: "/moonbag",
    element: (
      <DefaultLayout>
        <MoonBagCalculator initialBaseAmount={1000} initialQuoteAmount={500} currentPrice={0.5} />
      </DefaultLayout>
    )
  },
  {
    path: "/fiat-currency",
    element: (
      <DefaultLayout>
        <SearchableFiatCurrencySelector onSelect={(item) => { console.log(`${JSON.stringify(item)} selected!`) }} />
      </DefaultLayout>
    )
  }
])