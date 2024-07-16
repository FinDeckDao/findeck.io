module Network {
  type Network = {
    name : Text;
    nativeAsset : Text;
  };

  public let networks : [Network] = [
    { name = "Avalanche"; nativeAsset = "AVAX" },
    { name = "Bitcoin"; nativeAsset = "BTC" },
    { name = "Ethereum"; nativeAsset = "ETH" },
    { name = "Internet Computer"; nativeAsset = "ICP" },
    { name = "Solana"; nativeAsset = "SOL" },
    { name = "Stellar"; nativeAsset = "XLM" },
    { name = "US Dollar"; nativeAsset = "USD" },
    { name = "XinFin"; nativeAsset = "XDC" },
    { name = "XRPL"; nativeAsset = "XRP" },
  ];
};
