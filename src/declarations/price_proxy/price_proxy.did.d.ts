import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Asset {
  'img_url' : string,
  'name' : string,
  'slug' : string,
  'variant' : AssetVariant,
  'symbol' : string,
}
export interface AssetPair { 'base' : Asset, 'quote' : Asset }
export type AssetVariant = { 'Cryptocurrency' : null } |
  { 'FiatCurrency' : null };
export interface PairPrice {
  'pair' : AssetPair,
  'timestamp' : bigint,
  'price' : number,
}
export interface UnsupportedPair { 'pair' : AssetPair, 'lastAttempt' : bigint }
export interface _SERVICE {
  'clearUnsupportedPairs' : ActorMethod<[], undefined>,
  'getCacheStatus' : ActorMethod<
    [AssetPair],
    { 'not_cached' : null } |
      { 'expired' : null } |
      { 'cached' : { 'timestamp' : bigint, 'price' : number } }
  >,
  'getExchangeRate' : ActorMethod<[AssetPair], [] | [PairPrice]>,
  'getUnsupportedPairs' : ActorMethod<[], Array<UnsupportedPair>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
