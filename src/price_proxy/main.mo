import AssetModule "../modules/Asset/main";
import Buffer "mo:base/Buffer";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Time "mo:base/Time";
import XRC "canister:xrc";

import Types "./types";

actor PriceProxy {
  type UnsupportedPair = Types.UnsupportedPair;
  type PairPrice = Types.PairPrice;
  type Asset = AssetModule.Asset;
  type XrcAsset = Types.XrcAsset;

  // Time constant for rechecking unsupported pairs (30 days in nanoseconds)
  let THIRTY_DAYS_NS : Int = 30 * 24 * 60 * 60 * 1_000_000_000;

  // Define data persistence for the unsupported pairs
  private stable var unsupportedPairs : [UnsupportedPair] = [];
  private let unsupportedPairsBuffer = Buffer.Buffer<UnsupportedPair>(0);

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

  //////////////////////////////////////////////////////////////////////
  // Price Functions
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

  // Main function to get exchange rate for a pair of assets
  // TODO: This needs to be refactored to include the asset type.
  public func getExchangeRate(AssetPair : AssetModule.AssetPair) : async ?PairPrice {
    // Debug output for received AssetPair
    Debug.print("Received AssetPair:");
    Debug.print("Base symbol: " # AssetPair.base.symbol);
    Debug.print("Base variant: " # debug_show (AssetPair.base.variant));
    Debug.print("Quote symbol: " # AssetPair.quote.symbol);
    Debug.print("Quote variant: " # debug_show (AssetPair.quote.variant));

    // Skip XRC call if pair is known to be unsupported and was checked recently
    if (isUnsupportedPair(AssetPair)) {
      Debug.print("Pair is unsupported");
      return null;
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

    // Debug output for XRC request
    Debug.print("XRC Request:");
    Debug.print("Base symbol: " # request.base_asset.symbol);
    Debug.print("Base class: " # debug_show (request.base_asset.class_));
    Debug.print("Quote symbol: " # request.quote_asset.symbol);
    Debug.print("Quote class: " # debug_show (request.quote_asset.class_));

    Cycles.add<system>(10_000_000_000);
    let response = await XRC.get_exchange_rate(request);

    // Debug output for XRC response
    Debug.print("XRC Response: " # debug_show (response));

    switch (response) {
      case (#Ok(rate_response)) {
        let float_rate = Float.fromInt(Nat64.toNat(rate_response.rate));
        let float_divisor = Float.fromInt(Nat32.toNat(10 ** rate_response.metadata.decimals));
        let price = float_rate / float_divisor;

        Debug.print("Calculated price: " # debug_show (price));

        ?{
          pair = AssetPair;
          price;
          timestamp = Time.now();
        };
      };
      case (#Err(error)) {
        // Only mark as unsupported for specific "not supported" errors
        switch (error) {
          case (
            #CryptoBaseAssetNotFound or #CryptoQuoteAssetNotFound or #ForexBaseAssetNotFound or #ForexQuoteAssetNotFound
          ) {
            let reason = switch (error) {
              case (#CryptoBaseAssetNotFound) "Base asset not supported";
              case (#CryptoQuoteAssetNotFound) "Quote asset not supported";
              case (#ForexBaseAssetNotFound) "Base forex asset not supported";
              case (#ForexQuoteAssetNotFound) "Quote forex asset not supported";
              case (_) ""; // This case will never happen due to pattern match above
            };
            Debug.print("Asset not supported: " # reason);
            addUnsupportedPair(AssetPair, reason);
          };
          case (#StablecoinRateNotFound) {
            // Handle stablecoin rate not found - temporary error, don't mark as unsupported
            Debug.print("Stablecoin rate temporarily unavailable");
          };
          case (_) {
            // Handle other temporary errors
            Debug.print("Temporary error occurred, will retry on next request");
          };
        };
        null;
      };
    };
  };

  // Query function to get the list of unsupported pairs
  public query func getUnsupportedPairs() : async [UnsupportedPair] {
    Buffer.toArray(unsupportedPairsBuffer);
  };
};
