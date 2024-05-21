export interface Network {
  name: string
  nativeAsset: string
}

// export interface Xrpl extends Network {
//   name: 'XRP Ledger'
//   nativeAsset: 'XRP'
// }

export const Fiat: Network = {
  name: 'US Dollar',
  nativeAsset: 'USD'
}

// export interface Solana extends Network {
//   name: 'Solana'
//   nativeAsset: 'SOL'
// }

// export interface Ethereum extends Network {
//   name: 'Ethereum'
//   nativeAsset: 'ETH'
// }

// export interface Bitcoin extends Network {
//   name: 'Bitcoin'
//   nativeAsset: 'BTC'
// }

export const InternetComputer: Network = {
  name: 'Internet Computer',
  nativeAsset: 'ICP'
}

export const Stellar: Network = {
  name: 'Stellar',
  nativeAsset: 'XLM'
}

// export interface Avalanche extends Network {
//   name: 'Avalanche'
//   nativeAsset: 'AVAX'
// }

export const XinFin: Network = {
  name: 'XinFin',
  nativeAsset: 'XDC'
}
