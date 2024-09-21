import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import AssetModule "./Asset/main";

module WatchListManager {
  public type WatchListItems = HashMap.HashMap<Principal, AssetModule.AssetPair>;

  public func create(watchListItems : WatchListItems, owner : Principal, assetPair : AssetModule.AssetPair) : Result.Result<(), Text> {
    switch (watchListItems.get(owner)) {
      case (?_) { #err("Watch list item already exists for this user") };
      case null {
        watchListItems.put(owner, assetPair);
        #ok();
      };
    };
  };

  public func read(watchListItems : WatchListItems, owner : Principal) : Result.Result<AssetModule.AssetPair, Text> {
    switch (watchListItems.get(owner)) {
      case (?assetPair) { #ok(assetPair) };
      case null { #err("Watch list item not found") };
    };
  };

  public func getAllForPrincipal(watchListItems : WatchListItems, owner : Principal) : [AssetModule.AssetPair] {
    switch (watchListItems.get(owner)) {
      case (?assetPair) { [assetPair] };
      case null { [] };
    };
  };

  public func update(watchListItems : WatchListItems, owner : Principal, assetPair : AssetModule.AssetPair) : Result.Result<(), Text> {
    switch (watchListItems.get(owner)) {
      case (?_) {
        watchListItems.put(owner, assetPair);
        #ok();
      };
      case null { #err("Watch list item not found") };
    };
  };

  public func delete(watchListItems : WatchListItems, owner : Principal, assetPairToDelete : AssetModule.AssetPair) : Result.Result<(), Text> {
    switch (watchListItems.get(owner)) {
      case (?storedAssetPair) {
        if (areAssetPairsEqual(storedAssetPair, assetPairToDelete)) {
          ignore watchListItems.remove(owner);
          #ok();
        } else {
          #err("Asset pair does not match the stored watch list item");
        };
      };
      case null { #err("Watch list item not found") };
    };
  };

  // Helper function to compare AssetPairs
  private func areAssetPairsEqual(a : AssetModule.AssetPair, b : AssetModule.AssetPair) : Bool {
    a.base.symbol == b.base.symbol and a.quote.symbol == b.quote.symbol
  };

  public func list(watchListItems : WatchListItems) : [AssetModule.AssetPair] {
    Iter.toArray(watchListItems.vals());
  };
};
