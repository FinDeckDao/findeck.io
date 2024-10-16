import {
  createActorContext
} from '@ic-reactor/react'

import {
  wishlist_manager,
  idlFactory as wishlistManagerIdlFactory,
  canisterId as wishlistManagerCanisterId
} from '../../../../declarations/wishlist_manager'

type wishlistManagerActor = typeof wishlist_manager

export const {
  ActorProvider: WishlistManagerProvider,
  useActorState: useWishlistManagerState,
  useMethod: useWishlistManagerMethod,
  useQueryCall: useWishlistManagerQueryCall,
  useUpdateCall: useWishlistManagerUpdateCall
} = createActorContext<wishlistManagerActor>({
  canisterId: wishlistManagerCanisterId,
  idlFactory: wishlistManagerIdlFactory
})