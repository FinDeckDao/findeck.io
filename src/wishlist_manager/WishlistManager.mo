import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Types "types";

module WishlistManager {
  public func createOrUpdate(
    wishlistItems : Types.WishlistItems,
    owner : Principal,
    newWishlistItem : Types.WishlistItem,
  ) : Result.Result<(), Text> {
    switch (wishlistItems.get(owner)) {
      case (?existingItems) {
        // Filter out the matching items if a match exists
        let nonMatchingItems = Array.filter<Types.WishlistItem>(
          existingItems,
          func(item) {
            not (item.base.symbol == newWishlistItem.base.symbol);
          },
        );

        // Add the new item (this will either update the existing one or add a new one)
        let updatedItems = Array.append(nonMatchingItems, [newWishlistItem]);
        wishlistItems.put(owner, updatedItems);
        #ok();
      };
      case null {
        wishlistItems.put(owner, [newWishlistItem]);
        #ok();
      };
    };
  };

  public func read(wishlistItems : Types.WishlistItems, owner : Principal) : Result.Result<[Types.WishlistItem], Text> {
    switch (wishlistItems.get(owner)) {
      case (?wishlistItem) {
        if (wishlistItem.size() > 0) {
          #ok(wishlistItem);
        } else {
          #err("Wishlist is empty for this user");
        };
      };
      case null { #err("Wishlist not found for this user") };
    };
  };

  public func getAllForPrincipal(wishlistItems : Types.WishlistItems, owner : Principal) : [Types.WishlistItem] {
    switch (wishlistItems.get(owner)) {
      case (?items) { items };
      case null { [] };
    };
  };

  public func update(wishlistItems : Types.WishlistItems, owner : Principal, item : Types.WishlistItem) : Result.Result<(), Text> {
    switch (wishlistItems.get(owner)) {
      case (?_) {
        wishlistItems.put(owner, [item]);
        #ok();
      };
      case null { #err("Wishlist item not found") };
    };
  };

  public func removeFromWishlist(wishlistItems : Types.WishlistItems, owner : Principal, itemToRemove : Types.WishlistItem) : Result.Result<(), Text> {
    switch (wishlistItems.get(owner)) {
      case (?existingItems) {
        let updatedItems = Array.filter(
          existingItems,
          func(item : Types.WishlistItem) : Bool {
            not areItemsEqual(item, itemToRemove);
          },
        );
        if (updatedItems.size() == existingItems.size()) {
          #err("Item not found in the wishlist");
        } else {
          wishlistItems.put(owner, updatedItems);
          #ok();
        };
      };
      case null {
        #err("No wishlist found for this user");
      };
    };
  };

  public func listTopItems(wishlistItems : Types.WishlistItems, limit : Nat) : [Types.WishlistItem] {
    let itemCounts = HashMap.HashMap<Text, (Types.WishlistItem, Nat)>(10, Text.equal, Text.hash);

    // Helper function to create a unique key for an item
    func itemToKey(item : Types.WishlistItem) : Text {
      item.base.slug;
    };

    // Count occurrences of each item across all records
    for (userPairs in wishlistItems.vals()) {
      for (pair in userPairs.vals()) {
        let key = itemToKey(pair);
        let (existingItem, count) = switch (itemCounts.get(key)) {
          case (null) (pair, 1);
          case (?existing) (existing.0, existing.1 + 1);
        };
        itemCounts.put(key, (existingItem, count));
      };
    };

    // Filter pairs that appear more than once
    let filteredPairs = HashMap.mapFilter<Text, (Types.WishlistItem, Nat), Types.WishlistItem>(
      itemCounts,
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

  // Helper function to compare items
  private func areItemsEqual(a : Types.WishlistItem, b : Types.WishlistItem) : Bool {
    a.base.symbol == b.base.symbol;
  };

  public func list(wishlistItems : Types.WishlistItems) : [Types.WishlistItem] {
    let allPairs = Iter.toArray(wishlistItems.vals());
    Array.flatten(allPairs);
  };
};
