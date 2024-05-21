import {
  Fiat,
  // Ethereum,
  Stellar,
  // Avalanche,
  // Solana,
  // Xrpl,
  // Bitcoin,
  InternetComputer,
  XinFin,
  Network
} from '../networks'

export interface Asset {
  network: Network
  symbol: string
  name: string
}

export const Usd: Asset = {
  network: Fiat,
  symbol: Fiat.nativeAsset,
  name: Fiat.name
}

// export type Usdc = {
//   network: Ethereum | Stellar | Solana | Avalanche
//   symbol: 'USDC'
//   name: 'USD Circle'
// }

// export type Xrp = {
//   network: Xrpl
//   symbol: 'XRP'
//   name: 'XRP'
// }

// export type Eth = {
//   network: Ethereum
//   symbol: 'ETH'
//   name: 'Ethereum'
// }

// export type Btc = {
//   network: Bitcoin
//   symbol: 'BTC'
//   name: 'Bitcoin'
// }

export const Icp: Asset = {
  network: InternetComputer,
  symbol: InternetComputer.nativeAsset,
  name: InternetComputer.name
}

export const Velo: Asset = {
  network: Stellar,
  symbol: 'VELO',
  name: 'Velo'
}

export const Shx: Asset = {
  network: Stellar,
  symbol: 'SHX',
  name: 'Stronghold'
}

// export type Avax = {
//   network: 'avax'
//   symbol: 'AVAX'
//   name: 'Avalanche'
// }

// export type Sol = {
//   network: 'solana'
//   symbol: 'SOL'
//   name: 'Solana'
// }

export const Wtk: Asset = {
  network: XinFin,
  symbol: 'WTK',
  name: 'WadsPay'
}

export const SupportedAssets = [Usd, Icp, Velo, Shx, Wtk]
