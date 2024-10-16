import {
  createActorContext
} from '@ic-reactor/react'

import {
  trade_manager,
  idlFactory as tradeManagerIdlFactory,
  canisterId as tradeManagerCanisterId
} from '../../../../declarations/trade_manager'

type tradeManagerActor = typeof trade_manager

export const {
  ActorProvider: TradeManagerProvider,
  useActorState: useTradeManagerState,
  useMethod: useTradeManagerMethod,
  useQueryCall: useTradeManagerQueryCall,
  useUpdateCall: useTradeManagerUpdateCall
} = createActorContext<tradeManagerActor>({
  canisterId: tradeManagerCanisterId,
  idlFactory: tradeManagerIdlFactory
})
