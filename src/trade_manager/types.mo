import AssetModule "../modules/Asset/main";

module {
  public type Trade = {
    assetPair : AssetModule.AssetPair;
    dateOfTrade : Int; // Represented as a Unix timestamp
    baseAssetAmount : Float; // Represented as baseAmount * 10^18
    quoteAssetAmount : Float; // Represented as quoteAmount * 10^18
  };
};
