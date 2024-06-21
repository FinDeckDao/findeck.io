import { Router, Request, Response } from 'express'
export const router = Router()

// Returns the latest price for all the cryptocurrencies we track.
router.get('/prices', (_req: Request, res: Response) => {
  res.json({ prices: 'prices' })
})

interface PricesParams {
  id: string
}

// Takes an optional parameter for the currency symbol
router.get('/prices/:id', (req: Request<PricesParams>, res: Response) => {
  const { id } = req.params
  res.send(`Item ID: ${id}`)
})
