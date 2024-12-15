import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CapitalGainsTaxRate {
  'shortTerm' : number,
  'longTerm' : number,
}
export interface Profile {
  'theme' : Theme,
  'name' : string,
  'role' : Role,
  'capitalGainsTaxRate' : CapitalGainsTaxRate,
}
export type Result = { 'ok' : Profile } |
  { 'err' : string };
export type Result__1 = { 'ok' : string } |
  { 'err' : string };
export type Role = { 'Administrator' : null } |
  { 'Member' : null };
export type Theme = { 'Light' : null } |
  { 'System' : null } |
  { 'Dark' : null };
export interface _SERVICE {
  'createProfile' : ActorMethod<[Profile], Result__1>,
  'deleteProfile' : ActorMethod<[], Result__1>,
  'getAllProfiles' : ActorMethod<[], Array<[Principal, Profile]>>,
  'getProfile' : ActorMethod<[], Result>,
  'init' : ActorMethod<[], undefined>,
  'updateProfile' : ActorMethod<[Profile], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
