import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout/index.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'
import { Home } from '../Screens/Home'
import { Auth } from "../components/Auth/index.tsx"

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
      <Auth>
        <DefaultLayout>
          <>Positions Authenticated</>
        </DefaultLayout >
      </Auth>
    )
  },
  {
    path: "/dashboard",
    element: (
      <Auth>
        <DefaultLayout>
          <>Dashboard Authenticated</>
        </DefaultLayout>
      </Auth>
    )
  }
])