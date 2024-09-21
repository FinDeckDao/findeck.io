import Array "mo:base/Array";
import AssetModule "./Asset/main";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";

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

  public func listTopItems(watchListItems : WatchListItems, limit : Nat) : [AssetModule.AssetPair] {
    let pairCounts = HashMap.HashMap<Text, (AssetModule.AssetPair, Nat)>(10, Text.equal, Text.hash);

    // Helper function to create a unique key for an AssetPair
    func assetPairToKey(pair : AssetModule.AssetPair) : Text {
      pair.base.slug # "_" # pair.quote.slug;
    };

    // Count occurrences of each AssetPair across all records
    for (userPairs in watchListItems.vals()) {
      for (pair in userPairs.vals()) {
        let key = assetPairToKey(pair);
        let (existingPair, count) = switch (pairCounts.get(key)) {
          case (null) (pair, 1);
          case (?existing) (existing.0, existing.1 + 1);
        };
        pairCounts.put(key, (existingPair, count));
      };
    };

    // Filter pairs that appear more than once
    let filteredPairs = HashMap.mapFilter<Text, (AssetModule.AssetPair, Nat), AssetModule.AssetPair>(
      pairCounts,
      Text.equal,
      Text.hash,
      func(_, v) = if (v.1 > 1) ?v.0 else null,
    );

    // Convert to array
    let finalPairs = Iter.toArray(filteredPairs.vals());

    // Return all items or up to the limit
    if (finalPairs.size() <= limit) {
      finalPairs;
    } else {
      Array.subArray(finalPairs, 0, limit);
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
