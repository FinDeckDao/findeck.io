import AssetModule "../modules/Asset/main";

module {
  // New types for price tracking
  public type PairPrice = {
    pair : AssetModule.AssetPair;
    price : Float;
    timestamp : Int;
  };

  public type UnsupportedPair = {
    pair : AssetModule.AssetPair;
    lastAttempt : Int;
  };
};
