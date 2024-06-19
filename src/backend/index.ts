import { Server } from 'azle'
import express, { Request, Response } from 'express'
import apiRouter from './routes/api'

export default Server(() => {
  const app = express()

  app.use(express.json())

  // Mount the API router at the /v1/ path
  // app.get('v1/', apiRouter)

  app.get('v1/prices', (_: Request, res: Response) => {
    res.json({ message: 'prices will come from here just provide the asset' })
  })

  app.get('v1/test', (req, res) => {
    res.json({ message: 'test' })
  })

  // The home route is handled automatically and serves up a build of the frontend.
  // app.get('/', Don't need this because we are using the frontend build as static files).
  app.use(express.static('/dist'))

  // Setup the listener
  return app.listen()
})
