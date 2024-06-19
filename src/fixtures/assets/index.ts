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
  // TODO: Make this more flexible for now this is only used for the coinpaprika API.
  exchangeId: string
}

// Native Assets
export const Avax: Asset = {
  network: Avalanche,
  symbol: Avalanche.nativeAsset,
  name: Avalanche.name,
  exchangeId: 'avax-avalanche'
}

export const Sol: Asset = {
  network: Solana,
  symbol: Solana.nativeAsset,
  name: Solana.name,
  exchangeId: 'sol-solana'
}

export const Usd: Asset = {
  network: Fiat,
  symbol: Fiat.nativeAsset,
  name: Fiat.name,
  exchangeId: 'usd'
}

export const Xrp: Asset = {
  network: Xrpl,
  symbol: Xrpl.nativeAsset,
  name: 'XRP', // XRP is the native asset of the XRP Ledger.
  exchangeId: 'xrp-ripple'
}

export const Eth: Asset = {
  network: Ethereum,
  symbol: Ethereum.nativeAsset,
  name: Ethereum.name,
  exchangeId: 'eth-ethereum'
}

export const Btc: Asset = {
  network: Bitcoin,
  symbol: Bitcoin.nativeAsset,
  name: Bitcoin.name,
  exchangeId: 'btc-bitcoin'
}

export const Icp: Asset = {
  network: InternetComputer,
  symbol: InternetComputer.nativeAsset,
  name: InternetComputer.name,
  exchangeId: 'internet-computer-icp'
}

// Tokens
export const Usdc: Asset = {
  network: Stellar,
  symbol: 'USDC',
  name: 'USD Circle',
  exchangeId: 'usdc'
}

export const Velo: Asset = {
  network: Stellar,
  symbol: 'VELO',
  name: 'Velo',
  exchangeId: 'velo-velo'
}

export const Shx: Asset = {
  network: Stellar,
  symbol: 'SHX',
  name: 'Stronghold',
  exchangeId: 'shx-stronghold'
}

export const Wtk: Asset = {
  network: XinFin,
  symbol: 'WTK',
  name: 'WadsPay',
  exchangeId: 'wtk-wadspay'
}

export const Xlm: Asset = {
  network: Stellar,
  symbol: Stellar.nativeAsset,
  name: Stellar.name,
  exchangeId: 'xlm-stellar'
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
