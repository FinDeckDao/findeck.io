import { signal } from "@preact/signals-react"
import { Asset } from '../../lib/assets'

export interface PositionProps {
  base: Asset // Base Currency (e.g. ICP)
  quote: Asset // Quote Currency (e.g. USD)
  amount: number // Amount of Base Currency
  price: number // Price of Base Currency in Quote Currency
}

export const position = signal<PositionProps | null>(null)