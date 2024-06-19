import { Request, Response } from 'express'

export const home = (req: Request, res: Response) => {
  const data = {
    message: 'Hello, World!'
  }
  res.json(data)
}
