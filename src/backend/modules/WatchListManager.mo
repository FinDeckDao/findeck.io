import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import AssetModule "./Asset/main";

module WatchListManager {
  type AssetPair = AssetModule.AssetPair;

  public class WatchList() {
    private var items = HashMap.HashMap<Principal, AssetPair>(10, Principal.equal, Principal.hash);

    public func create(owner : Principal, assetPair : AssetPair) : Result.Result<(), Text> {
      switch (items.get(owner)) {
        case (?_) { #err("Watch list item already exists for this user") };
        case null {
          items.put(owner, assetPair);
          #ok();
        };
      };
    };

    public func read(owner : Principal) : Result.Result<AssetPair, Text> {
      switch (items.get(owner)) {
        case (?assetPair) { #ok(assetPair) };
        case null { #err("Watch list item not found") };
      };
    };

    public func update(owner : Principal, assetPair : AssetPair) : Result.Result<(), Text> {
      switch (items.get(owner)) {
        case (?_) {
          items.put(owner, assetPair);
          #ok();
        };
        case null { #err("Watch list item not found") };
      };
    };

    public func delete(owner : Principal, assetPairToDelete : AssetPair) : Result.Result<(), Text> {
      switch (items.get(owner)) {
        case (?storedAssetPair) {
          if (areAssetPairsEqual(storedAssetPair, assetPairToDelete)) {
            ignore items.remove(owner);
            #ok();
          } else {
            #err("Asset pair does not match the stored watch list item");
          };
        };
        case null { #err("Watch list item not found") };
      };
    };

    // Helper function to compare AssetPairs
    private func areAssetPairsEqual(a : AssetPair, b : AssetPair) : Bool {
      a.base.symbol == b.base.symbol and a.quote.symbol == b.quote.symbol
    };

    public func list() : [AssetPair] {
      Iter.toArray(items.vals());
    };
  };
};
