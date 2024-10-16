import Principal "mo:base/Principal";
import Types "./types";
import Error "mo:base/Error";
import PositionManager "./PositionManager";

actor PositionManagerActor {
  private stable var positionEntries : [(Principal, [Types.Position])] = [];
  private var state : PositionManager.State = PositionManager.setEntries(positionEntries);

  // The authorized principal (ensure that only a local dev can call the init function)
  // TODO: Make this only possible from the DAO in the future.
  private let AUTHORIZED_PRINCIPAL : Principal = Principal.fromText("yhjql-nw3u5-wp5r3-f2hid-ukmmv-7sy2z-on5ts-pl7fd-yrzpz-rjgdr-zqe");

  // Initialize the canister (calling this is destructive but is sometimes needed)
  public shared ({ caller }) func init() : async () {
    if (caller != AUTHORIZED_PRINCIPAL) {
      throw Error.reject("Unauthorized: only the owner can initialize the canister");
    };

    state := PositionManager.emptyState();
  };

  //////////////////////////////////////////////////////////////////////
  // Lifecycle Functions
  //////////////////////////////////////////////////////////////////////
  system func preupgrade() {
    positionEntries := PositionManager.getEntries(state);
  };

  system func postupgrade() {
    state := PositionManager.setEntries(positionEntries);
    positionEntries := [];
  };

  //////////////////////////////////////////////////////////////////////
  // Position Call Handlers
  //////////////////////////////////////////////////////////////////////
  public shared (msg) func addPosition(position : Types.Position) : async () {
    state := PositionManager.addPosition(state, msg.caller, position);
  };

  public shared (msg) func getPositions() : async ?[Types.Position] {
    PositionManager.getPositions(state, msg.caller);
  };

  public shared (msg) func updatePosition(index : Nat, updatedPosition : Types.Position) : async Bool {
    let (newState, changed) = PositionManager.updatePosition(state, msg.caller, index, updatedPosition);
    state := newState;
    changed;
  };

  public shared (msg) func removePosition(index : Nat) : async Bool {
    let (newState, changed) = PositionManager.removePosition(state, msg.caller, index);
    state := newState;
    changed;
  };
};
