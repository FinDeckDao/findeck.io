import { Icp, Usd, Velo } from '../assets'
import { Position } from '../../src/Components/Position'

// This data should be store in a database for paying customers
// but for free customers, we can store it in the frontend.
export const positions: Position[] = [
  {
    base: Icp,
    quote: Usd,
    trades: [
      {
        index: 1,
        amount: 1,
        price: 100,
        type: 'buy',
        date: '2024-05-01',
        base: Icp,
        quote: Usd
      },
      {
        index: 2,
        amount: 2,
        price: 200,
        type: 'buy',
        date: '2024-05-02',
        base: Icp,
        quote: Usd
      },
      {
        index: 3,
        amount: 3,
        price: 300,
        type: 'buy',
        date: '2024-05-03',
        base: Icp,
        quote: Usd
      },
      {
        index: 4,
        amount: 1,
        price: 400,
        type: 'sell',
        date: '2024-05-04',
        base: Icp,
        quote: Usd
      }
    ]
  },
  {
    base: Velo,
    quote: Usd,
    trades: [
      {
        index: 1,
        amount: 25000,
        price: 0.01,
        type: 'buy',
        date: '2024-05-01',
        base: Velo,
        quote: Usd
      },
      {
        index: 2,
        amount: 25000,
        price: 0.005,
        type: 'buy',
        date: '2024-05-02',
        base: Velo,
        quote: Usd
      },
      {
        index: 3,
        amount: 25000,
        price: 0.004,
        type: 'buy',
        date: '2024-05-03',
        base: Velo,
        quote: Usd
      },
      {
        index: 4,
        amount: 50000,
        price: 0.005,
        type: 'sell',
        date: '2024-05-04',
        base: Velo,
        quote: Usd
      }
    ]
  }
]
