import express, { Request, Response, NextFunction } from 'express'
import { router } from './routes/api/index'
import fs from 'fs'

const app = express()

app.use(express.json())

// This is the API
app.use('/v1', router)

// This delivers the frontend
// The dist folder is provided withing the ICP canister
// by the dfx.json configuration file.
app.use(
  express.static('/dist', {
    dotfiles: 'allow'
  })
)

// This is the catch-all middleware that delivers the frontend.
// The frontend is a single-page application (SPA) that presents errors to the user.
app.use((_err: any, req: Request, res: Response, _next: NextFunction) => {
  // if the requested file exist in the dist folder, it will be served.
  // const fileList = fs.readdirSync('/dist')

  // // The requested file is the path without the first slash.
  // const inputFile = req.path.replace('/', '')

  // // If they have requested a file that exists in the dist folder, it will be served.
  // if (fileList.includes(inputFile)) {
  //   res.status(200).sendFile(`/dist${req.path}`)
  // }

  // if not, the index.html file will
  res.status(200).sendFile('/dist/index.html')
})

app.listen()
