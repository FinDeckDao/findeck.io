import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout/index.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'
import { Home } from '../Screens/Home'
import { DashboardScreen } from "../Screens/Dashboard"
import { PositionsScreen } from "../Screens/Positions"

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
  {
    path: "/positions",
    element: (
      <DefaultLayout>
        <PositionsScreen />
      </DefaultLayout >
    )
  },
  {
    path: "/dashboard",
    element: (
      <DefaultLayout>
        <DashboardScreen />
      </DefaultLayout>
    )
  }
])