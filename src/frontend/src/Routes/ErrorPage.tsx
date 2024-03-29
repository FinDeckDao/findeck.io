import { useRouteError, isRouteErrorResponse } from "react-router-dom"

export const ErrorPage = () => {
  const error = useRouteError()

  return (
    <div id="error-page">
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