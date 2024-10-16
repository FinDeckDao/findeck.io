import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
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
    let itemScores = HashMap.HashMap<Text, (Types.WishlistItem, Nat)>(10, Text.equal, Text.hash);

    // Helper function to create a unique key for an item based on the base asset
    func itemToKey(item : Types.WishlistItem) : Text {
      item.base.slug; // Using slug as the unique identifier
    };

    // Helper function to count "Yes" answers
    func countYesAnswers(answers : Types.DueDiligenceAnswers) : Nat {
      Array.foldLeft<Types.Answer, Nat>(
        answers,
        0,
        func(acc, answer) {
          switch (answer) {
            case (#Yes) acc + 1;
            case (#No) acc;
          };
        },
      );
    };

    // Calculate scores for each unique item
    for (userPairs in wishlistItems.vals()) {
      for (pair in userPairs.vals()) {
        let key = itemToKey(pair);
        let yesCount = countYesAnswers(pair.DueDiligence);

        switch (itemScores.get(key)) {
          case (null) {
            // New item, add it to the map
            itemScores.put(key, (pair, yesCount));
          };
          case (?existing) {
            // Existing item, update the score and keep the existing WishlistItem
            let newScore = existing.1 + yesCount;
            itemScores.put(key, (existing.0, newScore));
          };
        };
      };
    };

    // Convert to array and sort by score
    var scoredItems = Iter.toArray(itemScores.vals());
    scoredItems := Array.sort(
      scoredItems,
      func(a : (Types.WishlistItem, Nat), b : (Types.WishlistItem, Nat)) : Order.Order {
        Nat.compare(b.1, a.1) // Sort in descending order
      },
    );

    // Extract just the WishlistItems, discarding the scores
    let finalItems = Array.map<(Types.WishlistItem, Nat), Types.WishlistItem>(
      scoredItems,
      func((item, _)) : Types.WishlistItem { item },
    );

    // Return all items or up to the limit
    if (finalItems.size() <= limit) {
      finalItems;
    } else {
      Array.subArray(finalItems, 0, limit);
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
