import AssetModule "../modules/Asset/main";

module {
  // Trade type variants
  public type TradeType = {
    #buy;
    #sell;
  };

  // What makes up a trade?
  public type Trade = {
    assetPair : AssetModule.AssetPair;
    tradeDateTime : Int; // Represented as a Unix timestamp
    baseAssetAmount : Float; // Represented as baseAmount * 10^18
    quoteAssetAmount : Float; // Represented as quoteAmount * 10^18
    tradeType : TradeType; // Buy or sell
    createdAt : Int; // Represented as a Unix timestamp
    deletedAt : ?Int; // Represented as a Unix timestamp, null if not deleted
  };
};
