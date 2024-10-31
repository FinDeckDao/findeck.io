import Array "mo:base/Array";
import AssetModule "../modules/Asset/main";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
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

  public func createTrade(
    trades : Trades,
    caller : Principal,
    assetPair : AssetModule.AssetPair,
    baseAmount : Float,
    quoteAmount : Float,
    tradeType : Types.TradeType,
    tradeDateTime : Int,
  ) : Result.Result<(Nat, Nat), Text> {
    let currentTime = Time.now();
    let newTrade : Types.Trade = {
      assetPair = assetPair;
      tradeDateTime = tradeDateTime;
      baseAssetAmount = baseAmount;
      quoteAssetAmount = quoteAmount;
      tradeType = tradeType;
      createdAt = currentTime;
      deletedAt = null;
    };

    let userTrades = switch (trades.get(caller)) {
      case (null) { [newTrade] };
      case (?existingTrades) { Array.append(existingTrades, [newTrade]) };
    };

    trades.put(caller, userTrades);
    let newCount = userTrades.size();

    if (newCount > 0) {
      let index : Nat = newCount - 1;
      #ok((newCount, index));
    } else {
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

  public func updateTrade(
    trades : Trades,
    caller : Principal,
    index : Nat,
    baseAmount : ?Float,
    quoteAmount : ?Float,
  ) : Result.Result<(), Text> {
    switch (trades.get(caller)) {
      case (null) { #err("No trades found for the user") };
      case (?userTrades) {
        if (index >= userTrades.size()) {
          return #err("Trade index out of bounds");
        };
        let updatedTrade = {
          assetPair = userTrades[index].assetPair;
          tradeDateTime = userTrades[index].tradeDateTime;
          baseAssetAmount = switch (baseAmount) {
            case (null) { userTrades[index].baseAssetAmount };
            case (?amount) { amount };
          };
          quoteAssetAmount = switch (quoteAmount) {
            case (null) { userTrades[index].quoteAssetAmount };
            case (?amount) { amount };
          };
          tradeType = userTrades[index].tradeType;
          createdAt = userTrades[index].createdAt;
          deletedAt = userTrades[index].deletedAt;
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
        let currentTime = Time.now();
        let updatedTrades = Array.tabulate<Types.Trade>(
          userTrades.size(),
          func(i) {
            if (i == index) {
              {
                assetPair = userTrades[i].assetPair;
                tradeDateTime = userTrades[i].tradeDateTime;
                baseAssetAmount = userTrades[i].baseAssetAmount;
                quoteAssetAmount = userTrades[i].quoteAssetAmount;
                tradeType = userTrades[i].tradeType;
                createdAt = userTrades[i].createdAt;
                deletedAt = ?currentTime;
              };
            } else {
              userTrades[i];
            };
          },
        );
        trades.put(caller, updatedTrades);
        #ok(());
      };
    };
  };

  public func listTradesForUser(trades : Trades, user : Principal) : [Types.Trade] {
    switch (trades.get(user)) {
      case (null) {
        [];
      };
      case (?userTrades) {
        Array.filter(
          userTrades,
          func(trade : Types.Trade) : Bool {
            switch (trade.deletedAt) {
              case (null) { true };
              case (?_) { false };
            };
          },
        );
      };
    };
  };

  public func getTotalTrades(trades : Trades) : Nat {
    var total = 0;
    for (userTrades in trades.vals()) {
      let activeTrades = Array.filter(
        userTrades,
        func(trade : Types.Trade) : Bool {
          switch (trade.deletedAt) {
            case (null) { true };
            case (?_) { false };
          };
        },
      );
      total += activeTrades.size();
    };
    total;
  };
};
