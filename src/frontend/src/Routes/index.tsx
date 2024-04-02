import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout/index.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'
import { Home } from '../Screens/Home'

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
        <>Positions Authenticated</>
      </DefaultLayout >
    )
  },
  {
    path: "/dashboard",
    element: (
      <DefaultLayout>
        <>Dashboard Authenticated</>
      </DefaultLayout>
    )
  }
])