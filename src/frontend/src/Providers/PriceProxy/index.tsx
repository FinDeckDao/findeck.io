import {
  createActorContext
} from '@ic-reactor/react'

import {
  price_proxy,
  idlFactory as priceProxyIdlFactory,
  canisterId as priceProxyCanisterId
} from '../../../../declarations/price_proxy'

type priceProxyActor = typeof price_proxy

export const {
  ActorProvider: PriceProxyProvider,
  useActorState: usePriceProxyState,
  useMethod: usePriceProxyMethod,
  useQueryCall: usePriceProxyQueryCall,
  useUpdateCall: usePriceProxyUpdateCall
} = createActorContext<priceProxyActor>({
  canisterId: priceProxyCanisterId,
  idlFactory: priceProxyIdlFactory
})