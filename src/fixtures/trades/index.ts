import { Icp, Usd, Usdc, Velo } from '../assets'
import { Trade } from '../../frontend/src/Contexts/Trade'

export const trades: Trade[] = [
  {
    amount: 1,
    assetPair: { base: Icp, quote: Usd },
    price: 1,
    time: '9:01AM',
    date: '2024-10-01',
    type: 'buy'
  },
  {
    amount: 2,
    assetPair: { base: Icp, quote: Usd },
    price: 2,
    time: '9:02AM',
    date: '2024-10-02',
    type: 'buy'
  },
  {
    amount: 1,
    assetPair: { base: Velo, quote: Usdc },
    price: 1,
    time: '9:03AM',
    date: '2024-10-03',
    type: 'buy'
  },
  {
    amount: 2,
    assetPair: { base: Velo, quote: Usdc },
    price: 2,
    time: '9:04AM',
    date: '2024-10-04',
    type: 'buy'
  }
]
