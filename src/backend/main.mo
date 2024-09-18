import Array "mo:base/Array";
import Asset "modules/Asset";
import Cycles "mo:base/ExperimentalCycles";
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

actor Backend {
  // Globals
  type Result = Result.Result<Text, Text>;

  //////////////////////////////////////////////////////////////////////
  // Profile Functions
  //////////////////////////////////////////////////////////////////////

  // Create a stable variable to store the data
  private stable var profileEntries : [(Principal, Types.Profile)] = [];

  // Create a HashMap to store the profiles
  private var profiles = HashMap.HashMap<Principal, Types.Profile>(
    10,
    Principal.equal,
    Principal.hash,
  );

  // LifeCycle hooks to handle upgrades properly.
  // Initialize the HashMap with the stable data
  system func preupgrade() {
    profileEntries := Iter.toArray(profiles.entries());
  };

  // Write the HashMap back to the stable variable
  system func postupgrade() {
    profiles := HashMap.fromIter<Principal, Types.Profile>(
      profileEntries.vals(),
      10,
      Principal.equal,
      Principal.hash,
    );
  };

  // Create: Add a new profile
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
  public shared (msg) func updateProfile(updatedProfile : Types.Profile) : async Bool {
    let caller = msg.caller;
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

  func getSupportedAsset(Symbol : Text) : Asset.AssetType {
    let foundAsset = Array.find<Asset.AssetType>(
      Asset.Assets,
      func(asset : Asset.AssetType) : Bool {
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
