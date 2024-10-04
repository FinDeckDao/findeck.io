import AssetModule "../modules/Asset/main";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TradeManager "./TradeManager";

actor TradeManagerActor {
  // Define data persistence for the trades.
  private stable var tradeEntries : [(Principal, [TradeManager.Trade])] = [];

  // Create a hash map to store the trades into local Canister Memory.
  private var trades = HashMap.HashMap<Principal, [TradeManager.Trade]>(
    10,
    Principal.equal,
    Principal.hash,
  );

  //////////////////////////////////////////////////////////////////////
  // Lifecycle Functions
  //////////////////////////////////////////////////////////////////////
  system func preupgrade() {
    // Write the trades to Stable Memory before upgrading the canister.
    tradeEntries := Iter.toArray(trades.entries());
  };

  system func postupgrade() {
    // Read the trades from Stable Memory into local Canister Memory.
    trades := HashMap.fromIter<Principal, [TradeManager.Trade]>(
      tradeEntries.vals(),
      10,
      Principal.equal,
      Principal.hash,
    );
  };

  //////////////////////////////////////////////////////////////////////
  // Trade Call Handlers
  //////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createTrade(
    assetPair : AssetModule.AssetPair,
    baseAmount : Float,
    quoteAmount : Float,
  ) : async Nat {
    TradeManager.createTrade(trades, caller, assetPair, baseAmount, quoteAmount);
  };

  public query ({ caller }) func readTrade(
    index : Nat
  ) : async Result.Result<TradeManager.Trade, Text> {
    TradeManager.readTrade(trades, caller, index);
  };

  public shared ({ caller }) func updateTrade(
    index : Nat,
    baseAmount : ?Float,
    quoteAmount : ?Float,
  ) : async Result.Result<(), Text> {
    TradeManager.updateTrade(trades, caller, index, baseAmount, quoteAmount);
  };

  public shared ({ caller }) func deleteTrade(index : Nat) : async Result.Result<(), Text> {
    TradeManager.deleteTrade(trades, caller, index);
  };

  public query ({ caller }) func listMyTrades() : async [TradeManager.Trade] {
    TradeManager.listTradesForUser(trades, caller);
  };

  public query func getTotalTrades() : async Nat {
    TradeManager.getTotalTrades(trades);
  };

};
