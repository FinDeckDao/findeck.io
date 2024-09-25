export interface Asset {
  name: string;
  symbol: string;
  slug: string;
  img_url: string;
}

export interface AssetPair {
  base: Asset;
  quote: Asset;
}
