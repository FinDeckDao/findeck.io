import AssetModule "../modules/Asset/main";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import TradeManager "./TradeManager";
import Types "types";

actor TradeManagerActor {
  private type Trade = Types.Trade;

  // Define data persistence for the trades.
  private stable var tradeEntries : [(Principal, [Trade])] = [];

  // Create a hash map to store the trades into local Canister Memory.
  private var state : TradeManager.State = TradeManager.emptyState();

  // The authorized principal (ensure that only a local dev can call the init function)
  // TODO: Make this only possible from the DAO in the future.
  private let AUTHORIZED_PRINCIPAL : Principal = Principal.fromText("yhjql-nw3u5-wp5r3-f2hid-ukmmv-7sy2z-on5ts-pl7fd-yrzpz-rjgdr-zqe");

  // Initialize the canister (calling this is destructive but is sometimes needed)
  public shared ({ caller }) func init() : async () {
    if (caller != AUTHORIZED_PRINCIPAL) {
      throw Error.reject("Unauthorized: only the owner can initialize the canister");
    };

    state := TradeManager.emptyState();
  };

  //////////////////////////////////////////////////////////////////////
  // Lifecycle Functions
  //////////////////////////////////////////////////////////////////////
  system func preupgrade() {
    // Write the trades to Stable Memory before upgrading the canister.
    tradeEntries := TradeManager.getEntries(state);
  };

  system func postupgrade() {
    // Read the trades from Stable Memory into local Canister Memory.
    state := TradeManager.setEntries(tradeEntries);
  };

  //////////////////////////////////////////////////////////////////////
  // Trade Call Handlers
  //////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createTrade(
    assetPair : AssetModule.AssetPair,
    baseAmount : Float,
    quoteAmount : Float,
  ) : async Nat {
    let (newState, index) = TradeManager.createTrade(state, caller, assetPair, baseAmount, quoteAmount);
    state := newState;
    index;
  };

  public query ({ caller }) func readTrade(
    index : Nat
  ) : async Result.Result<Trade, Text> {
    TradeManager.readTrade(state, caller, index);
  };

  public shared ({ caller }) func updateTrade(
    index : Nat,
    baseAmount : ?Float,
    quoteAmount : ?Float,
  ) : async Result.Result<(), Text> {
    let (newState, result) = TradeManager.updateTrade(state, caller, index, baseAmount, quoteAmount);
    state := newState;
    result;
  };

  public shared ({ caller }) func deleteTrade(index : Nat) : async Result.Result<(), Text> {
    let (newState, result) = TradeManager.deleteTrade(state, caller, index);
    state := newState;
    result;
  };

  public query ({ caller }) func getUserTrades() : async [Trade] {
    TradeManager.listTradesForUser(state, caller);
  };

  public query func getTotalTrades() : async Nat {
    TradeManager.getTotalTrades(state);
  };
};
