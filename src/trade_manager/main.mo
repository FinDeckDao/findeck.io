import AssetModule "../modules/Asset/main";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import TradeManager "./TradeManager";
import Types "types";

actor TradeManagerActor {
  private type Trade = Types.Trade;

  // Define data persistence for the trades.
  private stable var tradeEntries : [(Principal, [Trade])] = [];

  // Create a HashMap in local canister memory to be used for CRUD operations on trades.
  private var trades = HashMap.HashMap<Principal, [Trade]>(
    10,
    Principal.equal,
    Principal.hash,
  );

  // The authorized principal (ensure that only a local dev can call the init function)
  // TODO: Make this only possible from the DAO in the future.
  private let AUTHORIZED_PRINCIPAL : Principal = Principal.fromText("yhjql-nw3u5-wp5r3-f2hid-ukmmv-7sy2z-on5ts-pl7fd-yrzpz-rjgdr-zqe");

  // Initialize the canister (calling this is destructive but is sometimes needed)
  public shared ({ caller }) func init() : async () {
    if (caller != AUTHORIZED_PRINCIPAL) {
      throw Error.reject("Unauthorized: only the owner can initialize the canister");
    };

    trades := HashMap.HashMap<Principal, [Trade]>(10, Principal.equal, Principal.hash);
  };

  //////////////////////////////////////////////////////////////////////
  // Lifecycle Functions
  //////////////////////////////////////////////////////////////////////
  system func preupgrade() {
    tradeEntries := Iter.toArray(trades.entries());
  };

  system func postupgrade() {
    trades := HashMap.fromIter<Principal, [Trade]>(
      tradeEntries.vals(),
      10,
      Principal.equal,
      Principal.hash,
    );
    tradeEntries := []; // Clear the stable variable after loading
  };

  //////////////////////////////////////////////////////////////////////
  // Trade Call Handlers
  //////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createTrade(
    assetPair : AssetModule.AssetPair,
    baseAmount : Float,
    quoteAmount : Float,
    tradeType : Types.TradeType,
    tradeDateTime : ?Int,
  ) : async Result.Result<Nat, Text> {
    let currentTime = Time.now();
    let tradeTime = switch (tradeDateTime) {
      case (null) { currentTime };
      case (?time) { time };
    };

    let result = TradeManager.createTrade(
      trades,
      caller,
      assetPair,
      baseAmount,
      quoteAmount,
      tradeType,
      tradeTime,
    );

    switch (result) {
      case (#ok(newCountAndIndex)) {
        let (_newCount, index) = newCountAndIndex;
        #ok(index);
      };
      case (#err(errorMsg)) {
        #err(errorMsg);
      };
    };
  };

  public query ({ caller }) func readTrade(index : Nat) : async Result.Result<Trade, Text> {
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

  public query ({ caller }) func getUserTrades() : async [Trade] {
    let userTrades = TradeManager.listTradesForUser(trades, caller);
    userTrades;
  };

  public query func getTotalTrades() : async Nat {
    let total = TradeManager.getTotalTrades(trades);
    total;
  };
};
