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
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Trade } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : string };
export interface Trade {
  'tradeType' : TradeType,
  'quoteAssetAmount' : number,
  'createdAt' : bigint,
  'baseAssetAmount' : number,
  'assetPair' : AssetPair,
  'tradeDateTime' : bigint,
  'deletedAt' : [] | [bigint],
}
export type TradeType = { 'buy' : null } |
  { 'sell' : null };
export interface _SERVICE {
  'createTrade' : ActorMethod<
    [AssetPair, number, number, TradeType, [] | [bigint]],
    Result_2
  >,
  'deleteTrade' : ActorMethod<[bigint], Result>,
  'getTotalTrades' : ActorMethod<[], bigint>,
  'getUserTrades' : ActorMethod<[], Array<Trade>>,
  'readTrade' : ActorMethod<[bigint], Result_1>,
  'updateTrade' : ActorMethod<[bigint, [] | [number], [] | [number]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
