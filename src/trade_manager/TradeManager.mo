import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import AssetModule "../modules/Asset/main";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Types "types";

module TradeManager {
  private type Trade = Types.Trade;

  // Helper functions for fixed-point arithmetic
  public func floatToFixedPoint(value : Float) : Nat {
    let scaleFactor : Float = 1e18;
    let scaled : Int = Float.toInt(value * scaleFactor);
    Int.abs(scaled);
  };

  public func fixedPointToFloat(value : Nat) : Float {
    let scaleFactor : Float = 1e18;
    Float.fromInt(value) / scaleFactor;
  };

  public func createTrade(trades : HashMap.HashMap<Principal, [Trade]>, caller : Principal, assetPair : AssetModule.AssetPair, baseAmount : Float, quoteAmount : Float) : Nat {
    let newTrade : Trade = {
      assetPair = assetPair;
      dateOfTrade = Time.now();
      baseAssetAmount = floatToFixedPoint(baseAmount);
      quoteAssetAmount = floatToFixedPoint(quoteAmount);
    };

    let userTrades = switch (trades.get(caller)) {
      case (null) { [newTrade] };
      case (?existingTrades) { Array.append(existingTrades, [newTrade]) };
    };

    let _ = trades.put(caller, userTrades);
    userTrades.size() - 1 // Return the index of the new trade
  };

  public func readTrade(trades : HashMap.HashMap<Principal, [Trade]>, caller : Principal, index : Nat) : Result.Result<Trade, Text> {
    switch (trades.get(caller)) {
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

  public func updateTrade(trades : HashMap.HashMap<Principal, [Trade]>, caller : Principal, index : Nat, baseAmount : ?Float, quoteAmount : ?Float) : Result.Result<(), Text> {
    switch (trades.get(caller)) {
      case (null) { #err("No trades found for the user") };
      case (?userTrades) {
        if (index >= userTrades.size()) {
          return #err("Trade index out of bounds");
        };
        let updatedTrade = {
          assetPair = userTrades[index].assetPair;
          dateOfTrade = userTrades[index].dateOfTrade;
          baseAssetAmount = switch (baseAmount) {
            case (null) { userTrades[index].baseAssetAmount };
            case (?amount) { floatToFixedPoint(amount) };
          };
          quoteAssetAmount = switch (quoteAmount) {
            case (null) { userTrades[index].quoteAssetAmount };
            case (?amount) { floatToFixedPoint(amount) };
          };
        };
        let updatedTrades = Array.tabulate<Trade>(
          userTrades.size(),
          func(i) {
            if (i == index) { updatedTrade } else { userTrades[i] };
          },
        );
        let _ = trades.put(caller, updatedTrades);
        #ok(());
      };
    };
  };

  public func deleteTrade(trades : HashMap.HashMap<Principal, [Trade]>, caller : Principal, index : Nat) : Result.Result<(), Text> {
    switch (trades.get(caller)) {
      case (null) { #err("No trades found for the user") };
      case (?userTrades) {
        if (index >= userTrades.size()) {
          return #err("Trade index out of bounds");
        };
        let updatedTrades = Array.tabulate<Trade>(
          userTrades.size() - 1,
          func(i) {
            if (i < index) { userTrades[i] } else { userTrades[i + 1] };
          },
        );
        let _ = trades.put(caller, updatedTrades);
        #ok(());
      };
    };
  };

  public func listTradesForUser(trades : HashMap.HashMap<Principal, [Trade]>, user : Principal) : [Trade] {
    switch (trades.get(user)) {
      case (null) { [] };
      case (?userTrades) { userTrades };
    };
  };

  public func getTotalTrades(trades : HashMap.HashMap<Principal, [Trade]>) : Nat {
    var total = 0;
    for (userTrades in trades.vals()) {
      total += userTrades.size();
    };
    total;
  };
};
