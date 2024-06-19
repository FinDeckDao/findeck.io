import { Server } from 'azle'
import express from 'express'
import { home } from './route-handlers'

export default Server(() => {
  const app = express()

  app.use(express.json())

  app.get('/', home)

  app.use(express.static('/dist'))

  return app.listen()
})
