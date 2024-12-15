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
export interface Position {
  'assetPair' : AssetPair,
  'priceDate' : bigint,
  'price' : number,
}
export interface _SERVICE {
  'addPosition' : ActorMethod<[Position], undefined>,
  'getPositions' : ActorMethod<[], [] | [Array<Position>]>,
  'init' : ActorMethod<[], undefined>,
  'removePosition' : ActorMethod<[bigint], boolean>,
  'updatePosition' : ActorMethod<[bigint, Position], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
