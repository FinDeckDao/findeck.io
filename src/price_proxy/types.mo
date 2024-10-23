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

  // Defines type for an asset.
  public type XrcAsset = {
    symbol : Text;
    variant : AssetModule.AssetVariant;
  };

  public type XrcAssets = [XrcAsset];
};
