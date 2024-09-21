import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import AssetModule "./Asset/main";
import Array "mo:base/Array";

module WatchListManager {
  public type WatchListItems = HashMap.HashMap<Principal, [AssetModule.AssetPair]>;

  public func create(watchListItems : WatchListItems, owner : Principal, assetPair : AssetModule.AssetPair) : Result.Result<(), Text> {
    switch (watchListItems.get(owner)) {
      case (?existingItems) {
        let updatedItems = Array.append(existingItems, [assetPair]);
        watchListItems.put(owner, updatedItems);
        #ok();
      };
      case null {
        watchListItems.put(owner, [assetPair]);
        #ok();
      };
    };
  };

  public func read(watchListItems : WatchListItems, owner : Principal) : Result.Result<[AssetModule.AssetPair], Text> {
    switch (watchListItems.get(owner)) {
      case (?assetPairs) {
        if (assetPairs.size() > 0) {
          #ok(assetPairs);
        } else {
          #err("Watch list is empty for this user");
        };
      };
      case null { #err("Watch list not found for this user") };
    };
  };

  public func getAllForPrincipal(watchListItems : WatchListItems, owner : Principal) : [AssetModule.AssetPair] {
    switch (watchListItems.get(owner)) {
      case (?items) { items };
      case null { [] };
    };
  };

  public func update(watchListItems : WatchListItems, owner : Principal, assetPair : AssetModule.AssetPair) : Result.Result<(), Text> {
    switch (watchListItems.get(owner)) {
      case (?_) {
        watchListItems.put(owner, [assetPair]);
        #ok();
      };
      case null { #err("Watch list item not found") };
    };
  };

  public func removeFromWatchList(watchListItems : WatchListItems, owner : Principal, assetPairToRemove : AssetModule.AssetPair) : Result.Result<(), Text> {
    switch (watchListItems.get(owner)) {
      case (?existingItems) {
        let updatedItems = Array.filter(
          existingItems,
          func(item : AssetModule.AssetPair) : Bool {
            not areAssetPairsEqual(item, assetPairToRemove);
          },
        );
        if (updatedItems.size() == existingItems.size()) {
          #err("Asset pair not found in the watch list");
        } else {
          watchListItems.put(owner, updatedItems);
          #ok();
        };
      };
      case null {
        #err("No watch list found for this user");
      };
    };
  };

  // Helper function to compare AssetPairs
  private func areAssetPairsEqual(a : AssetModule.AssetPair, b : AssetModule.AssetPair) : Bool {
    a.base.symbol == b.base.symbol and a.quote.symbol == b.quote.symbol
  };

  public func list(watchListItems : WatchListItems) : [AssetModule.AssetPair] {
    let allPairs = Iter.toArray(watchListItems.vals());
    Array.flatten(allPairs);
  };
};
