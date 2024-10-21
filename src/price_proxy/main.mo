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

import Types "./types";

actor PriceProxy {
  type UnsupportedPair = Types.UnsupportedPair;
  type PairPrice = Types.PairPrice;
  type Asset = AssetModule.Asset;
  type AssetPair = AssetModule.AssetPair;
  type XrcAsset = AssetModule.XrcAsset;

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
  private func isUnsupportedPair(pair : AssetPair) : Bool {
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
  private func addUnsupportedPair(pair : AssetPair, reason : Text) {
    if (not isUnsupportedPair(pair)) {
      unsupportedPairsBuffer.add({
        pair;
        lastAttempt = Time.now();
        reason;
      });
    };
  };

  // Determine if an asset is cryptocurrency or fiat based on symbol and position
  private func getSupportedAsset(symbol : Text, isQuote : Bool) : XrcAsset {
    {
      symbol = symbol;
      variant = if (isQuote and (symbol == "USD" or symbol == "USDC" or symbol == "USDT"))
      #FiatCurrency else #Cryptocurrency;
    };
  };

  // Main function to get exchange rate for a pair of assets
  public func get_exchange_rate(base : Text, quote : Text) : async ?PairPrice {
    let pair : AssetPair = {
      base = { name = base; symbol = base; slug = base; img_url = "" };
      quote = { name = quote; symbol = quote; slug = quote; img_url = "" };
    };

    // Skip XRC call if pair is known to be unsupported and was checked recently
    if (isUnsupportedPair(pair)) {
      return null;
    };

    let baseAsset = getSupportedAsset(base, false);
    let quoteAsset = getSupportedAsset(quote, true);

    let request : XRC.GetExchangeRateRequest = {
      base_asset = {
        symbol = baseAsset.symbol;
        class_ = baseAsset.variant;
      };
      quote_asset = {
        symbol = quoteAsset.symbol;
        class_ = quoteAsset.variant;
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

        ?{
          pair;
          price;
          timestamp = Time.now();
        };
      };
      case (#Err(error)) {
        let reason = switch (error) {
          case (#CryptoBaseAssetNotFound) "Base asset not supported";
          case (#CryptoQuoteAssetNotFound) "Quote asset not supported";
          case (#ForexBaseAssetNotFound) "Base forex asset not supported";
          case (#ForexQuoteAssetNotFound) "Quote forex asset not supported";
          case (#StablecoinRateNotFound) "Stablecoin rate not available";
          case (_) "Other error occurred";
        };
        addUnsupportedPair(pair, reason);
        null;
      };
    };
  };

  // Query function to get the list of unsupported pairs
  public query func getUnsupportedPairs() : async [UnsupportedPair] {
    Buffer.toArray(unsupportedPairsBuffer);
  };
};
