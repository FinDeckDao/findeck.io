import express, { Request, Response, NextFunction } from 'express'
import { router } from './routes/api/index'

const app = express()

app.use(express.json())

// This is the API
app.use('/v1', router)

// This delivers the frontend
// The dist folder is provided withing the ICP canister
// by the dfx.json configuration file.
app.use(express.static('/dist'))

// This is the catch-all middleware that delivers the frontend.
// The frontend is a single-page application (SPA) that presents errors to the user.
app.use((_err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(200).sendFile('/dist/index.html')
})

app.listen()
