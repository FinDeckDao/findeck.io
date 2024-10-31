import Error "mo:base/Error";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Types "types";

actor Backend {
  // Globals
  type Result = Result.Result<Text, Text>;

  // Globals for XRC
  // type AssetType = AssetModule.AssetType;

  //////////////////////////////////////////////////////////////////////
  // Profile Variables
  //////////////////////////////////////////////////////////////////////

  // Create a stable variable to store the data
  private stable var profileEntries : [(Principal, Types.Profile)] = [];

  // Create a HashMap to store the profiles into local Canister Memory.
  private var profiles = HashMap.HashMap<Principal, Types.Profile>(
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
  };

  system func postupgrade() {
    // Read the profiles from Stable Memory into local Canister Memory.
    profiles := HashMap.fromIter<Principal, Types.Profile>(
      profileEntries.vals(),
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
};
