import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import AssetModule "../modules/Asset/main";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import Types "types";

module {
  public type Trades = HashMap.HashMap<Principal, [Types.Trade]>;

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

  public func createTrade(trades : Trades, caller : Principal, assetPair : AssetModule.AssetPair, baseAmount : Float, quoteAmount : Float) : Result.Result<(Nat, Nat), Text> {
    Debug.print("Creating trade for caller: " # debug_show (caller));
    let newTrade : Types.Trade = {
      assetPair = assetPair;
      dateOfTrade = Time.now();
      baseAssetAmount = baseAmount;
      quoteAssetAmount = quoteAmount;
    };

    let userTrades = switch (trades.get(caller)) {
      case (null) { [newTrade] };
      case (?existingTrades) { Array.append(existingTrades, [newTrade]) };
    };

    trades.put(caller, userTrades);
    let newCount = userTrades.size();

    if (newCount > 0) {
      let index : Nat = newCount - 1;
      Debug.print("Trade created. New trade count for caller: " # debug_show (newCount) # ", Index: " # debug_show (index));
      #ok((newCount, index));
    } else {
      Debug.print("Failed to create trade. User trade list is empty.");
      #err("Failed to create trade");
    };
  };

  public func readTrade(trades : Trades, caller : Principal, index : Nat) : Result.Result<Types.Trade, Text> {
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

  public func updateTrade(trades : Trades, caller : Principal, index : Nat, baseAmount : ?Float, quoteAmount : ?Float) : Result.Result<(), Text> {
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
        trades.put(caller, updatedTrades);
        #ok(());
      };
    };
  };

  public func deleteTrade(trades : Trades, caller : Principal, index : Nat) : Result.Result<(), Text> {
    switch (trades.get(caller)) {
      case (null) { #err("No trades found for the user") };
      case (?userTrades) {
        if (index >= userTrades.size()) {
          return #err("Trade index out of bounds");
        };
        let updatedTrades = Array.tabulate<Types.Trade>(
          userTrades.size() - 1,
          func(i) {
            if (i < index) { userTrades[i] } else { userTrades[i + 1] };
          },
        );
        trades.put(caller, updatedTrades);
        #ok(());
      };
    };
  };

  public func listTradesForUser(trades : Trades, user : Principal) : [Types.Trade] {
    Debug.print("Listing trades for user: " # debug_show (user));
    switch (trades.get(user)) {
      case (null) {
        Debug.print("No trades found for user");
        [];
      };
      case (?userTrades) {
        Debug.print("Found " # debug_show (userTrades.size()) # " trades for user");
        userTrades;
      };
    };
  };

  public func getTotalTrades(trades : Trades) : Nat {
    var total = 0;
    for (userTrades in trades.vals()) {
      total += userTrades.size();
    };
    total;
  };

  public func debugState(trades : Trades) : Text {
    var debugText = "Current state:\n";
    for ((principal, userTrades) in trades.entries()) {
      debugText #= "Principal: " # debug_show (principal) # ", Trades: " # debug_show (userTrades.size()) # "\n";
    };
    debugText;
  };
};
