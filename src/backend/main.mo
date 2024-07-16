import XRC "canister:xrc";
import Cycles "mo:base/ExperimentalCycles";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Asset "modules/Asset";
import Option "mo:base/Option";
import Text "mo:base/Text";

actor ExchangeRate {

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
