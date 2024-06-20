import { Server } from 'azle'
import express, { Request, Response } from 'express'
import { router } from './routes/api'

export default Server(() => {
  const app = express()

  app.use(express.json())

  // Mount the API router at the /v1/ path
  //  app.use('/v1', router)

  app.get('/v1', (_req: Request, res: Response) => {
    res.json({ message: 'Hello from v1' })
  })

  // The home route is handled automatically and serves up a build of the frontend.
  // app.get('/', Don't need this because we are using the frontend build as static files).
  app.use(express.static('/dist'))

  // Setup the listener
  return app.listen()
})
