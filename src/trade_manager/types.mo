import AssetModule "../modules/Asset/main";

module {
  public type Trade = {
    assetPair : AssetModule.AssetPair;
    dateOfTrade : Int; // Represented as a Unix timestamp
    baseAssetAmount : Nat; // Represented as baseAmount * 10^18
    quoteAssetAmount : Nat; // Represented as quoteAmount * 10^18
  };
};
