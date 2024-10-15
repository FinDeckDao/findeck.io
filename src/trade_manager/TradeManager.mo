import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import AssetModule "../modules/Asset/main";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Types "types";

module {
  public type State = HashMap.HashMap<Principal, [Types.Trade]>;

  // Helper functions remain unchanged
  public func floatToFixedPoint(value : Float) : Nat {
    let scaleFactor : Float = 1e18;
    let scaled : Int = Float.toInt(value * scaleFactor);
    Int.abs(scaled);
  };

  public func fixedPointToFloat(value : Nat) : Float {
    let scaleFactor : Float = 1e18;
    Float.fromInt(value) / scaleFactor;
  };

  // Helper function to create a new state with updated entries
  private func updateState(state : State, caller : Principal, trades : [Types.Trade]) : State {
    let newState = HashMap.HashMap<Principal, [Types.Trade]>(state.size(), Principal.equal, Principal.hash);
    for ((key, value) in state.entries()) {
      if (Principal.equal(key, caller)) {
        newState.put(key, trades);
      } else {
        newState.put(key, value);
      };
    };
    newState;
  };

  public func createTrade(state : State, caller : Principal, assetPair : AssetModule.AssetPair, baseAmount : Float, quoteAmount : Float) : (State, Nat) {
    let newTrade : Types.Trade = {
      assetPair = assetPair;
      dateOfTrade = Time.now();
      baseAssetAmount = baseAmount;
      quoteAssetAmount = quoteAmount;
    };

    let userTrades = switch (state.get(caller)) {
      case (null) { [newTrade] };
      case (?existingTrades) { Array.append(existingTrades, [newTrade]) };
    };

    let updatedState = updateState(state, caller, userTrades);
    (updatedState, userTrades.size() - 1);
  };

  public func readTrade(state : State, caller : Principal, index : Nat) : Result.Result<Types.Trade, Text> {
    switch (state.get(caller)) {
      case (null) { #err("No trades found for the user") };
      case (?userTrades) {
        if (index < userTrades.size()) {
          #ok(userTrades[index]);
        } else {
          #err("Trade index out of bounds");
        };
      };
    };
  };

  public func updateTrade(state : State, caller : Principal, index : Nat, baseAmount : ?Float, quoteAmount : ?Float) : (State, Result.Result<(), Text>) {
    switch (state.get(caller)) {
      case (null) { (state, #err("No trades found for the user")) };
      case (?userTrades) {
        if (index >= userTrades.size()) {
          return (state, #err("Trade index out of bounds"));
        };
        let updatedTrade = {
          assetPair = userTrades[index].assetPair;
          dateOfTrade = userTrades[index].dateOfTrade;
          baseAssetAmount = switch (baseAmount) {
            case (null) { userTrades[index].baseAssetAmount };
            case (?amount) { amount };
          };
          quoteAssetAmount = switch (quoteAmount) {
            case (null) { userTrades[index].quoteAssetAmount };
            case (?amount) { amount };
          };
        };
        let updatedTrades = Array.tabulate<Types.Trade>(
          userTrades.size(),
          func(i) { if (i == index) { updatedTrade } else { userTrades[i] } },
        );
        let updatedState = updateState(state, caller, updatedTrades);
        (updatedState, #ok(()));
      };
    };
  };

  public func deleteTrade(state : State, caller : Principal, index : Nat) : (State, Result.Result<(), Text>) {
    switch (state.get(caller)) {
      case (null) { (state, #err("No trades found for the user")) };
      case (?userTrades) {
        if (index >= userTrades.size()) {
          return (state, #err("Trade index out of bounds"));
        };
        let updatedTrades = Array.tabulate<Types.Trade>(
          userTrades.size() - 1,
          func(i) {
            if (i < index) { userTrades[i] } else { userTrades[i + 1] };
          },
        );
        let updatedState = updateState(state, caller, updatedTrades);
        (updatedState, #ok(()));
      };
    };
  };

  public func listTradesForUser(state : State, user : Principal) : [Types.Trade] {
    switch (state.get(user)) {
      case (null) { [] };
      case (?userTrades) { userTrades };
    };
  };

  public func getTotalTrades(state : State) : Nat {
    var total = 0;
    for (userTrades in state.vals()) {
      total += userTrades.size();
    };
    total;
  };

  public func emptyState() : State {
    HashMap.HashMap<Principal, [Types.Trade]>(10, Principal.equal, Principal.hash);
  };

  public func getEntries(state : State) : [(Principal, [Types.Trade])] {
    Iter.toArray(state.entries());
  };

  public func setEntries(entries : [(Principal, [Types.Trade])]) : State {
    HashMap.fromIter<Principal, [Types.Trade]>(entries.vals(), 10, Principal.equal, Principal.hash);
  };
};
