import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Types "types";
import WishlistManager "WishlistManager";

actor WishlistManagerActor {
  // Create a stable variable to persiste the wishlistEntries across upgrades.
  private stable var wishlistEntries : [(Principal, [Types.WishlistItem])] = [];

  // Create a HashMap in local canistermemory to be used for CRUD operations on wishlist items.
  private var wishlistItems = HashMap.HashMap<Principal, [Types.WishlistItem]>(
    10,
    Principal.equal,
    Principal.hash,
  );

  //////////////////////////////////////////////////////////////////////
  // Lifecycle Functions
  //////////////////////////////////////////////////////////////////////
  system func preupgrade() {
    // Write the wishlistEntries to Stable Memory before upgrading the canister.
    wishlistEntries := Iter.toArray(wishlistItems.entries());
  };

  system func postupgrade() {

    // Read the watchlist from Stable Memory into local Canister Memory.
    wishlistItems := HashMap.fromIter<Principal, [Types.WishlistItem]>(
      wishlistEntries.vals(),
      10,
      Principal.equal,
      Principal.hash,
    );
  };

  // The authorized principal (ensure that only a local dev can call the init function)
  // TODO: Make this only possible from the DAO in the future.
  private let AUTHORIZED_PRINCIPAL : Principal = Principal.fromText("yhjql-nw3u5-wp5r3-f2hid-ukmmv-7sy2z-on5ts-pl7fd-yrzpz-rjgdr-zqe");

  // Initialize the canister (calling this is destructive but is sometimes needed)
  public shared ({ caller }) func init() : async () {
    if (caller != AUTHORIZED_PRINCIPAL) {
      throw Error.reject("Unauthorized: only the owner can initialize the canister");
    };

    wishlistItems := HashMap.HashMap<Principal, [Types.WishlistItem]>(
      10,
      Principal.equal,
      Principal.hash,
    );
  };

  //////////////////////////////////////////////////////////////////////
  // Wishlist Functions
  //////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createWishlistItem(assetPair : Types.WishlistItem) : async Result.Result<(), Text> {
    WishlistManager.createOrUpdate(wishlistItems, caller, assetPair);
  };

  public shared ({ caller }) func getWishlistItem() : async Result.Result<[Types.WishlistItem], Text> {
    WishlistManager.read(wishlistItems, caller);
  };

  public shared ({ caller }) func getUserWishlist() : async [Types.WishlistItem] {
    WishlistManager.getAllForPrincipal(wishlistItems, caller);
  };

  public shared ({ caller }) func updateWishlistItem(assetPair : Types.WishlistItem) : async Result.Result<(), Text> {
    WishlistManager.update(wishlistItems, caller, assetPair);
  };

  public shared ({ caller }) func deleteWishlistItem(assetPairToDelete : Types.WishlistItem) : async Result.Result<(), Text> {
    WishlistManager.removeFromWishlist(wishlistItems, caller, assetPairToDelete);
  };

  // TODO: Setup a paginator for this function.
  public query func listAllWishlistItems() : async [Types.WishlistItem] {
    WishlistManager.list(wishlistItems);
  };

  // TODO: Refactor this to select the most watched assets.
  public query func getTopWatchedAssets() : async [Types.WishlistItem] {
    WishlistManager.listTopItems(wishlistItems, 100);
  };

  // Get the questions for due diligence
  public query func getDueDiligenceQuestions() : async [Types.Question] {
    Types.DUE_DILIGENCE_QUESTIONS;
  };
};
