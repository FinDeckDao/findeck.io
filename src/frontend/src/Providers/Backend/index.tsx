import {
  createActorContext
} from '@ic-reactor/react'

import {
  backend,
  idlFactory as backendIdlFactory,
  canisterId as backendCanisterId
} from '../../../../declarations/backend'

type backendActor = typeof backend

export const {
  ActorProvider: BackendProvider,
  useActorState: useBackendState,
  useMethod: useBackendMethod,
  useQueryCall: useBackendQueryCall,
  useUpdateCall: useBackendUpdateCall
} = createActorContext<backendActor>({
  canisterId: backendCanisterId,
  idlFactory: backendIdlFactory
})