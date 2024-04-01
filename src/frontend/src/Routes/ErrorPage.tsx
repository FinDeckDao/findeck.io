import { useRouteError, isRouteErrorResponse } from "react-router-dom"
import SidePanel from "../Layout/SidePanel"

export const ErrorPage = () => {
  const error = useRouteError()

  return (
    <div id="error-page" className=" bg-slate-800 w-full h-screen text-sky-100 p-4">
      <SidePanel />
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{isRouteErrorResponse(error)
          ? error.statusText || error.data.message
          : 'Unknown Error - Something is broken sorry.'}</i>
      </p>
    </div>
  )
}

export default ErrorPage