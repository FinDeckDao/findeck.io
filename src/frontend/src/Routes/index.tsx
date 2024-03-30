import {
  createBrowserRouter,
} from "react-router-dom"
import Layout from '../Layout/Layout.tsx'
import { ErrorPage } from '../Routes/ErrorPage.tsx'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><>Dashboard</></Layout>,
    errorElement: <Layout><ErrorPage /></Layout>
  },
  {
    path: "/positions",
    element: <Layout><>Positions</></Layout>
  }
])