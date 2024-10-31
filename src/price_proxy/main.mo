import AssetModule "../modules/Asset/main";
import Buffer "mo:base/Buffer";
import Cycles "mo:base/ExperimentalCycles";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Time "mo:base/Time";
import XRC "canister:xrc";
import HashMap "mo:base/HashMap";
import Types "types";

actor PriceProxy {
  type UnsupportedPair = Types.UnsupportedPair;
  type PairPrice = Types.PairPrice;
  type Asset = AssetModule.Asset;
  type XrcAsset = Types.XrcAsset;

  // Time constant for rechecking unsupported pairs (30 days in nanoseconds)
  let THIRTY_DAYS_NS : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
  // Cache duration (1 hour in nanoseconds)
  let CACHE_DURATION_NS : Int = 1 * 60 * 60 * 1_000_000_000;

  // Define data persistence for the unsupported pairs
  private stable var unsupportedPairs : [UnsupportedPair] = [];
  private let unsupportedPairsBuffer = Buffer.Buffer<UnsupportedPair>(0);

  // Define cache entry type
  type CachedPrice = {
    price : Float;
    timestamp : Int;
  };

  // Create HashMap for price cache (no stable storage needed)
  private let priceCache = HashMap.HashMap<Text, CachedPrice>(
    10,
    Text.equal,
    Text.hash,
  );

  private func initBuffer() {
    for (pair in unsupportedPairs.vals()) {
      unsupportedPairsBuffer.add(pair);
    };
  };
  initBuffer();

  //////////////////////////////////////////////////////////////////////
  // Lifecycle Functions
  //////////////////////////////////////////////////////////////////////
  system func preupgrade() {
    unsupportedPairs := Buffer.toArray(unsupportedPairsBuffer);
  };

  system func postupgrade() {
    initBuffer();
  };

  // Helper function to create cache key from AssetPair
  private func makeCacheKey(pair : AssetModule.AssetPair) : Text {
    Text.concat(Text.concat(pair.base.symbol, "/"), pair.quote.symbol);
  };

  // Helper function to check if cache entry is valid
  private func isCacheValid(entry : CachedPrice) : Bool {
    let currentTime = Time.now();
    (currentTime - entry.timestamp) < CACHE_DURATION_NS;
  };

  //////////////////////////////////////////////////////////////////////
  // Unsupported Pairs Functions
  //////////////////////////////////////////////////////////////////////

  // Check if a pair is in the unsupported list and if it's eligible for rechecking
  private func isUnsupportedPair(pair : AssetModule.AssetPair) : Bool {
    let currentTime = Time.now();

    for (unsupported in unsupportedPairsBuffer.vals()) {
      if (
        unsupported.pair.base.symbol == pair.base.symbol and
        unsupported.pair.quote.symbol == pair.quote.symbol
      ) {
        // Allow recheck if last attempt was more than 30 days ago
        return (currentTime - unsupported.lastAttempt) < THIRTY_DAYS_NS;
      };
    };
    false;
  };

  // Add a pair to the unsupported list with the current timestamp
  private func addUnsupportedPair(pair : AssetModule.AssetPair, reason : Text) {
    if (not isUnsupportedPair(pair)) {
      unsupportedPairsBuffer.add({
        pair;
        lastAttempt = Time.now();
        reason;
      });
    };
  };

  // Clear all unsupported pairs from the buffer
  public func clearUnsupportedPairs() : async () {
    unsupportedPairsBuffer.clear();
  };

  //////////////////////////////////////////////////////////////////////
  // Price Functions
  //////////////////////////////////////////////////////////////////////

  // Main function to get exchange rate for a pair of assets
  public func getExchangeRate(AssetPair : AssetModule.AssetPair) : async ?PairPrice {
    // Skip XRC call if pair is known to be unsupported and was checked recently
    if (isUnsupportedPair(AssetPair)) {
      return null;
    };

    let cacheKey = makeCacheKey(AssetPair);

    // Check cache first
    switch (priceCache.get(cacheKey)) {
      case (?cached) {
        if (isCacheValid(cached)) {
          return ?{
            pair = AssetPair;
            price = cached.price;
            timestamp = cached.timestamp;
          };
        };
        // Cache expired, will fetch new price
      };
      case null {}; // Cache miss, will fetch new price
    };

    let request : XRC.GetExchangeRateRequest = {
      base_asset = {
        symbol = Text.toLowercase(AssetPair.base.symbol);
        class_ = AssetPair.base.variant;
      };
      quote_asset = {
        symbol = Text.toLowercase(AssetPair.quote.symbol);
        class_ = AssetPair.quote.variant;
      };
      timestamp = null;
    };

    Cycles.add<system>(10_000_000_000);
    let response = await XRC.get_exchange_rate(request);

    switch (response) {
      case (#Ok(rate_response)) {
        let float_rate = Float.fromInt(Nat64.toNat(rate_response.rate));
        let float_divisor = Float.fromInt(Nat32.toNat(10 ** rate_response.metadata.decimals));
        let price = float_rate / float_divisor;
        let currentTime = Time.now();

        // Cache the new price
        priceCache.put(
          cacheKey,
          {
            price;
            timestamp = currentTime;
          },
        );

        ?{
          pair = AssetPair;
          price;
          timestamp = currentTime;
        };
      };
      case (#Err(error)) {
        // Only mark as unsupported for specific "not supported" errors
        switch (error) {
          case (
            #CryptoBaseAssetNotFound or
            #CryptoQuoteAssetNotFound or
            #ForexBaseAssetNotFound or
            #ForexQuoteAssetNotFound
          ) {
            let reason = switch (error) {
              case (#CryptoBaseAssetNotFound) "Base asset not supported";
              case (#CryptoQuoteAssetNotFound) "Quote asset not supported";
              case (#ForexBaseAssetNotFound) "Base forex asset not supported";
              case (#ForexQuoteAssetNotFound) "Quote forex asset not supported";
              case (_) ""; // This case will never happen due to pattern match above
            };
            // Asset is not supported
            addUnsupportedPair(AssetPair, reason);
          };
          case (#StablecoinRateNotFound) {}; // Stablecoin rate temporarily unavailable
          case (_) {}; // Temporary error occurred, will retry on next request
        };
        null;
      };
    };
  };

  // Query function to get the list of unsupported pairs
  public query func getUnsupportedPairs() : async [UnsupportedPair] {
    Buffer.toArray(unsupportedPairsBuffer);
  };

  // Helper query function to check cache status
  public query func getCacheStatus(pair : AssetModule.AssetPair) : async {
    #cached : { price : Float; timestamp : Int };
    #not_cached;
    #expired;
  } {
    let cacheKey = makeCacheKey(pair);
    switch (priceCache.get(cacheKey)) {
      case (?cached) {
        if (isCacheValid(cached)) {
          #cached({ price = cached.price; timestamp = cached.timestamp });
        } else {
          #expired;
        };
      };
      case null {
        #not_cached;
      };
    };
  };
};
