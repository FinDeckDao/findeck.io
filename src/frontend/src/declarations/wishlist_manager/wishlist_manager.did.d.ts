import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Answer = { 'No' : null } |
  { 'Yes' : null };
export interface Asset {
  'img_url' : string,
  'name' : string,
  'slug' : string,
  'variant' : AssetVariant,
  'symbol' : string,
}
export type AssetVariant = { 'Cryptocurrency' : null } |
  { 'FiatCurrency' : null };
export type DueDiligenceAnswers = Array<Answer>;
export interface Question {
  'id' : bigint,
  'question' : string,
  'hint' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<WishlistItem> } |
  { 'err' : string };
export interface WishlistItem {
  'base' : Asset,
  'DueDiligence' : DueDiligenceAnswers,
}
export interface _SERVICE {
  'createWishlistItem' : ActorMethod<[WishlistItem], Result>,
  'deleteWishlistItem' : ActorMethod<[WishlistItem], Result>,
  'getDueDiligenceQuestions' : ActorMethod<[], Array<Question>>,
  'getTopWatchedAssets' : ActorMethod<[], Array<WishlistItem>>,
  'getUserWishlist' : ActorMethod<[], Array<WishlistItem>>,
  'getWishlistItem' : ActorMethod<[], Result_1>,
  'init' : ActorMethod<[], undefined>,
  'listAllWishlistItems' : ActorMethod<[], Array<WishlistItem>>,
  'updateWishlistItem' : ActorMethod<[WishlistItem], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
