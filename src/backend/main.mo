import Array "mo:base/Array";
import AssetModule "modules/Asset/main";
import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Types "types";
import XRC "canister:xrc";
import WatchListModule "modules/WatchListManager";

actor Backend {
  // Globals
  type Result = Result.Result<Text, Text>;
  type AssetPair = AssetModule.AssetPair;
  type Asset = AssetModule.Asset;
  type AssetType = AssetModule.AssetType;

  //////////////////////////////////////////////////////////////////////
  // Profile Variables
  //////////////////////////////////////////////////////////////////////

  // Create a stable variable to store the data
  private stable var profileEntries : [(Principal, Types.Profile)] = [];
  private stable var watchListEntries : [(Principal, AssetPair)] = [];

  // Create a HashMap to store the profiles into local Canister Memory.
  private var profiles = HashMap.HashMap<Principal, Types.Profile>(
    10,
    Principal.equal,
    Principal.hash,
  );

  // Create a HashMap to store the profiles into local Canister Memory.
  private var watchListItems = HashMap.HashMap<Principal, AssetPair>(
    10,
    Principal.equal,
    Principal.hash,
  );

  //////////////////////////////////////////////////////////////////////
  // Lifecycle Functions
  //////////////////////////////////////////////////////////////////////
  system func preupgrade() {
    // Write the profiles to Stable Memory before upgrading the canister.
    profileEntries := Iter.toArray(profiles.entries());

    // Write the watchListEntries to Stable Memory before upgrading the canister.
    watchListEntries := Iter.toArray(watchListItems.entries());
  };

  system func postupgrade() {
    // Read the profiles from Stable Memory into local Canister Memory.
    profiles := HashMap.fromIter<Principal, Types.Profile>(
      profileEntries.vals(),
      10,
      Principal.equal,
      Principal.hash,
    );

    // Read the watchlist from Stable Memory into local Canister Memory.
    watchListItems := HashMap.fromIter<Principal, AssetPair>(
      watchListEntries.vals(),
      10,
      Principal.equal,
      Principal.hash,
    );
  };

  // The authorized principal (ensure that only a local dev can call the init function)
  // TODO: Make this only possible from the DAO in the future.
  private let AUTHORIZED_PRINCIPAL : Principal = Principal.fromText("yhjql-nw3u5-wp5r3-f2hid-ukmmv-7sy2z-on5ts-pl7fd-yrzpz-rjgdr-zqe");

  // Initialize the canister
  public shared ({ caller }) func init() : async () {
    if (caller != AUTHORIZED_PRINCIPAL) {
      throw Error.reject("Unauthorized: only the owner can initialize the canister");
    };

    profiles := HashMap.HashMap<Principal, Types.Profile>(10, Principal.equal, Principal.hash);
    watchListItems := HashMap.HashMap<Principal, AssetPair>(10, Principal.equal, Principal.hash);
  };

  //////////////////////////////////////////////////////////////////////
  // WatchList Functions
  //////////////////////////////////////////////////////////////////////
  let watchList = WatchListModule.WatchList();

  public shared ({ caller }) func createWatchListItem(assetPair : AssetPair) : async Result.Result<(), Text> {
    watchList.create(caller, assetPair);
  };

  public shared ({ caller }) func getWatchListItem() : async Result.Result<AssetPair, Text> {
    watchList.read(caller);
  };

  public shared ({ caller }) func updateWatchListItem(assetPair : AssetPair) : async Result.Result<(), Text> {
    watchList.update(caller, assetPair);
  };

  public shared ({ caller }) func deleteWatchListItem(assetPairToDelete : AssetPair) : async Result.Result<(), Text> {
    watchList.delete(caller, assetPairToDelete);
  };

  // TODO: Setup a paginator for this function.
  public query func listAllWatchListItems() : async [AssetPair] {
    watchList.list();
  };

  //////////////////////////////////////////////////////////////////////
  // Profile Functions
  //////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createProfile(profile : Types.Profile) : async Result {

    // Utility function to convert percentage to float (handles both Int and Float)
    func convertToFloat(value : Float) : Float {
      if (value >= 1.0) {
        return value / 100.0;
      } else {
        return value;
      };
    };

    // Utility function to process rate with a default value
    func processRate(rate : Float, defaultValue : Float) : Float {
      if (rate == 0.0) {
        defaultValue;
      } else {
        convertToFloat(rate);
      };
    };

    // Handle the capital gains tax rates.
    let capitalGains : Types.CapitalGainsTaxRate = {
      // Set short term capital gains tax to 30% if it's 0, otherwise convert from float
      shortTerm = processRate(profile.capitalGainsTaxRate.shortTerm, 0.30);
      // Set long term capital gains tax to 20% if it's 0, otherwise convert from float
      longTerm = processRate(profile.capitalGainsTaxRate.longTerm, 0.20);
    };

    // Construct a new profile from the data provided ()
    var newProfile : Types.Profile = {
      name = profile.name;
      // Assign the caller to the role of Member by default. The DAO can upgrade this user to an admin after a vote.
      role = #Member;
      capitalGainsTaxRate = capitalGains;
      theme = profile.theme;
    };

    switch (profiles.get(caller)) {
      case (null) {
        profiles.put(caller, newProfile);
        #ok("Profile for " # Principal.toText(caller) # " created successfully");
      };
      case (?_existing) {
        #err("Profile for " # Principal.toText(caller) # " already exists");
      };
    };
  };

  // Read: Get a profile by principal
  public shared query ({ caller }) func getProfile() : async Result.Result<Types.Profile, Text> {
    switch (profiles.get(caller)) {
      case (null) {
        #err("Profile for " # Principal.toText(caller) # " doesn't exists.");
      };
      case (?existing) {
        #ok(existing);
      };
    };
  };

  // Update: Update an existing profile
  public shared ({ caller }) func updateProfile(updatedProfile : Types.Profile) : async Bool {
    switch (profiles.get(caller)) {
      case (null) {
        false // Profile doesn't exist
      };
      case (?_existing) {
        profiles.put(caller, updatedProfile);
        true;
      };
    };
  };

  // Delete: Remove a profile
  public shared ({ caller }) func deleteProfile() : async Result {
    switch (profiles.remove(caller)) {
      case (null) {
        #err("Profile for " # Principal.toText(caller) # " doesn't exists.");
      };
      case (?_existing) {
        #ok("Profile for " # Principal.toText(caller) # " deleted successfully.");
      };
    };
  };

  // Additional helper function to get all profiles (for administrative purposes)
  public shared query ({ caller = _ }) func getAllProfiles() : async [(Principal, Types.Profile)] {
    Iter.toArray(profiles.entries());
  };

  //////////////////////////////////////////////////////////////////////
  // Exchange Rate Functions
  //////////////////////////////////////////////////////////////////////

  func getSupportedAsset(Symbol : Text) : AssetModule.AssetType {
    let foundAsset = Array.find<AssetModule.AssetType>(
      AssetModule.Assets,
      func(asset : AssetModule.AssetType) : Bool {
        asset.symbol == Symbol;
      },
    );
    return Option.get(foundAsset, { symbol = "BTC"; variant = #Cryptocurrency });
  };

  func convertToUSD(symbol : Text) : Text {
    var modifiedSymbol : Text = symbol;
    if (Text.contains(symbol, #text "USD")) {
      modifiedSymbol := "USD";
    };
    return modifiedSymbol;
  };

  // Extract the current exchange rate for the given symbol.
  public func get_exchange_rate(base : Text, quote : Text) : async Float {

    // XRC doesn't support stable tokens USDC or USDT.
    // If the quote or contains USD then we'll just convert it here.
    // If quote contains the substring USD then just define it as USD.
    let modifiedBase = convertToUSD(base);
    let modifiedQuote = convertToUSD(quote);

    // Determine if the type of each asset that has come in.
    let foundBase = getSupportedAsset(modifiedBase);
    let foundQuote = getSupportedAsset(modifiedQuote);

    // Map the text to the asset and construct a base and quote asset.

    let request : XRC.GetExchangeRateRequest = {
      base_asset = {
        symbol = modifiedBase;
        class_ = foundBase.variant;
      };
      quote_asset = {
        symbol = modifiedQuote;
        class_ = foundQuote.variant;
      };
      // Get the current rate.
      timestamp = null;
    };

    // Every XRC call needs 10B cycles (any unspent cycles are returned).
    Cycles.add<system>(10_000_000_000);
    let response = await XRC.get_exchange_rate(request);

    // Return 0.0 if there is an error for the sake of simplicity.
    switch (response) {
      case (#Ok(rate_response)) {
        let float_rate = Float.fromInt(Nat64.toNat(rate_response.rate));
        let float_divisor = Float.fromInt(Nat32.toNat(10 ** rate_response.metadata.decimals));
        return float_rate / float_divisor;
      };
      case _ {
        return 0.0;
      };
    };
  };
};
