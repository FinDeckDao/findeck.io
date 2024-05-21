import { Icp, Usd, Velo, Shx } from '../assets'
import { Position } from '../../src/Components/Position'

// This data should be store in a database for paying customers
// but for free customers, we can store it in the frontend.
export const positions: Position[] = [
  {
    owner: '',
    base: Icp,
    quote: Usd,
    trades: [
      {
        index: 1,
        amount: 3.98536,
        price: 50,
        type: 'buy',
        date: '2024-02-06',
        base: Icp,
        quote: Usd
      },
      {
        index: 2,
        amount: 1.88899,
        price: 25,
        type: 'buy',
        date: '2024-02-09',
        base: Icp,
        quote: Usd
      },
      {
        index: 3,
        amount: 2.00009,
        price: 26.14,
        type: 'buy',
        date: '2024-02-12',
        base: Icp,
        quote: Usd
      },
      {
        index: 4,
        amount: 7.50851,
        price: 100,
        type: 'buy',
        date: '2024-02-26',
        base: Icp,
        quote: Usd
      },
      {
        index: 5,
        amount: 8.06584,
        price: 105.8,
        type: 'buy',
        date: '2024-02-26',
        base: Icp,
        quote: Usd
      },
      {
        index: 6,
        amount: 18.44,
        price: 321.1,
        type: 'sell',
        date: '2024-03-28',
        base: Icp,
        quote: Usd
      },
      {
        index: 7,
        amount: 13.60521,
        price: 247.54,
        type: 'buy',
        date: '2024-03-30',
        base: Icp,
        quote: Usd
      },
      {
        index: 8,
        amount: 27.72755,
        price: 500,
        type: 'buy',
        date: '2024-04-01',
        base: Icp,
        quote: Usd
      },
      {
        index: 9,
        amount: 13.61522,
        price: 250,
        type: 'buy',
        date: '2024-04-04',
        base: Icp,
        quote: Usd
      },
      {
        index: 10,
        amount: 14.24237,
        price: 250,
        type: 'buy',
        date: '2024-04-04',
        base: Icp,
        quote: Usd
      },
      {
        index: 11,
        amount: 56.01811,
        price: 1000,
        type: 'buy',
        date: '2024-04-07',
        base: Icp,
        quote: Usd
      },
      {
        index: 12,
        amount: 1,
        price: 17.5,
        type: 'buy',
        date: '2024-04-07',
        base: Icp,
        quote: Usd
      },
      {
        index: 13,
        amount: 30.18698,
        price: 500,
        type: 'buy',
        date: '2024-04-09',
        base: Icp,
        quote: Usd
      },
      {
        index: 14,
        amount: 16.19062,
        price: 250,
        type: 'buy',
        date: '2024-04-12',
        base: Icp,
        quote: Usd
      },
      {
        index: 15,
        amount: 35.14348,
        price: 500,
        type: 'buy',
        date: '2024-04-12',
        base: Icp,
        quote: Usd
      },
      {
        index: 16,
        amount: 18.96499,
        price: 250,
        type: 'buy',
        date: '2024-04-13',
        base: Icp,
        quote: Usd
      },
      {
        index: 17,
        amount: 42.76996,
        price: 500,
        type: 'buy',
        date: '2024-04-13',
        base: Icp,
        quote: Usd
      },
      {
        index: 18,
        amount: 18.89285,
        price: 250,
        type: 'buy',
        date: '2024-04-14',
        base: Icp,
        quote: Usd
      },
      {
        index: 19,
        amount: 54.58295,
        price: 721.65,
        type: 'buy',
        date: '2024-04-18',
        base: Icp,
        quote: Usd
      },
      {
        index: 20,
        amount: 19.82549,
        price: 244.86,
        type: 'buy',
        date: '2024-04-18',
        base: Icp,
        quote: Usd
      },
      {
        index: 21,
        amount: 67,
        price: 994.49,
        type: 'sell',
        date: '2024-04-20',
        base: Icp,
        quote: Usd
      },
      {
        index: 22,
        amount: 100.76,
        price: 1487.15,
        type: 'sell',
        date: '2024-04-20',
        base: Icp,
        quote: Usd
      },
      {
        index: 23,
        amount: 300,
        price: 4280.97,
        type: 'buy',
        date: '2024-04-28',
        base: Icp,
        quote: Usd
      },
      {
        index: 24,
        amount: 100,
        price: 1273.25,
        type: 'buy',
        date: '2024-05-28',
        base: Icp,
        quote: Usd
      }
    ]
  },
  {
    owner: '',
    base: Velo,
    quote: Usd,
    trades: [
      {
        index: 1,
        amount: 200000,
        price: 2000,
        type: 'buy',
        date: '2024-05-01',
        base: Velo,
        quote: Usd
      }
    ]
  },
  {
    owner: '',
    base: Shx,
    quote: Usd,
    trades: [
      {
        index: 1,
        amount: 200000,
        price: 1100,
        type: 'buy',
        date: '2024-05-01',
        base: Shx,
        quote: Usd
      }
    ]
  }
]
