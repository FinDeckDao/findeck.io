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

// Delivers information required by IC to host our domain.
app.use(
  '/.well-known/ic-domains',
  express.static('/dist/.well-known/ic-domains')
)
app.use('/.ic-assets.json', express.static('/dist/.ic-assets.json'))

// This is the catch-all middleware that delivers the frontend.
// The frontend is a single-page application (SPA) that presents errors to the user.
app.use((_err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(200).sendFile('/dist/index.html')
})

app.listen()
