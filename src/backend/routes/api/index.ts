import { Router, Request, Response } from 'express'

export const router = Router()

// Example sub routes of v1
router.get('/prices', (_req: Request, res: Response) => {
  res.json({ message: 'prices will come from here just provide the asset' })
})
