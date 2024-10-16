import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "./types";

module {
  public type State = HashMap.HashMap<Principal, [Types.Position]>;

  public func addPosition(state : State, caller : Principal, position : Types.Position) : State {
    let updatedPositions = switch (state.get(caller)) {
      case (null) { [position] };
      case (?existingPositions) { Array.append(existingPositions, [position]) };
    };
    let newState = HashMap.HashMap<Principal, [Types.Position]>(state.size(), Principal.equal, Principal.hash);
    for ((key, value) in state.entries()) {
      if (Principal.equal(key, caller)) {
        newState.put(key, updatedPositions);
      } else {
        newState.put(key, value);
      };
    };
    newState;
  };

  public func getPositions(state : State, caller : Principal) : ?[Types.Position] {
    state.get(caller);
  };

  public func updatePosition(state : State, caller : Principal, index : Nat, updatedPosition : Types.Position) : (State, Bool) {
    switch (state.get(caller)) {
      case (null) { (state, false) };
      case (?existingPositions) {
        if (index >= existingPositions.size()) {
          return (state, false);
        };
        let updatedPositions = Array.tabulate<Types.Position>(
          existingPositions.size(),
          func(i) {
            if (i == index) { updatedPosition } else { existingPositions[i] };
          },
        );
        let newState = HashMap.HashMap<Principal, [Types.Position]>(state.size(), Principal.equal, Principal.hash);
        for ((key, value) in state.entries()) {
          if (Principal.equal(key, caller)) {
            newState.put(key, updatedPositions);
          } else {
            newState.put(key, value);
          };
        };
        (newState, true);
      };
    };
  };

  public func removePosition(state : State, caller : Principal, index : Nat) : (State, Bool) {
    switch (state.get(caller)) {
      case (null) { (state, false) };
      case (?existingPositions) {
        if (index >= existingPositions.size()) {
          return (state, false);
        };
        let updatedPositions = Array.tabulate<Types.Position>(
          existingPositions.size() - 1,
          func(i) {
            if (i < index) { existingPositions[i] } else {
              existingPositions[i + 1];
            };
          },
        );
        let newState = HashMap.HashMap<Principal, [Types.Position]>(state.size(), Principal.equal, Principal.hash);
        for ((key, value) in state.entries()) {
          if (Principal.equal(key, caller)) {
            newState.put(key, updatedPositions);
          } else {
            newState.put(key, value);
          };
        };
        (newState, true);
      };
    };
  };

  public func emptyState() : State {
    HashMap.HashMap<Principal, [Types.Position]>(10, Principal.equal, Principal.hash);
  };

  public func getEntries(state : State) : [(Principal, [Types.Position])] {
    Iter.toArray(state.entries());
  };

  public func setEntries(entries : [(Principal, [Types.Position])]) : State {
    HashMap.fromIter<Principal, [Types.Position]>(entries.vals(), 10, Principal.equal, Principal.hash);
  };
};
