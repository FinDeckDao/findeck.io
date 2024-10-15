import AssetModule "../modules/Asset/main";

module {
  public type Position = {
    assetPair : AssetModule.AssetPair;
    price : Float;
    priceDate : Int; // Represented as a Unix timestamp
  };
};
