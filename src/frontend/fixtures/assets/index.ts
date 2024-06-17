import {
  Fiat,
  Ethereum,
  Stellar,
  Avalanche,
  Solana,
  Xrpl,
  Bitcoin,
  InternetComputer,
  XinFin,
  Network
} from '../networks'

export interface Asset {
  network: Network
  symbol: string
  name: string
}

// Native Assets
export const Avax: Asset = {
  network: Avalanche,
  symbol: Avalanche.nativeAsset,
  name: Avalanche.name
}

export const Sol: Asset = {
  network: Solana,
  symbol: Solana.nativeAsset,
  name: Solana.name
}

export const Usd: Asset = {
  network: Fiat,
  symbol: Fiat.nativeAsset,
  name: Fiat.name
}

export const Xrp: Asset = {
  network: Xrpl,
  symbol: Xrpl.nativeAsset,
  name: 'XRP' // XRP is the native asset of the XRP Ledger.
}

export const Eth: Asset = {
  network: Ethereum,
  symbol: Ethereum.nativeAsset,
  name: Ethereum.name
}

export const Btc: Asset = {
  network: Bitcoin,
  symbol: Bitcoin.nativeAsset,
  name: Bitcoin.name
}

export const Icp: Asset = {
  network: InternetComputer,
  symbol: InternetComputer.nativeAsset,
  name: InternetComputer.name
}

// Tokens
export const Usdc: Asset = {
  network: Stellar,
  symbol: 'USDC',
  name: 'USD Circle'
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

export const Wtk: Asset = {
  network: XinFin,
  symbol: 'WTK',
  name: 'WadsPay'
}

export const Xlm: Asset = {
  network: Stellar,
  symbol: Stellar.nativeAsset,
  name: Stellar.name
}

export const SupportedAssets = [
  Avax,
  Btc,
  Eth,
  Icp,
  Shx,
  Sol,
  Usd,
  Usdc,
  Velo,
  Wtk,
  Xlm,
  Xrp
]
