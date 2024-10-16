// This module defines all the data types and functions required to manage assets.
module AssetModule {

  // Defines variants for the different asset classes that are supported by XRC.
  public type AssetClass = {
    #Cryptocurrency; // This is support annoying that it's not Cryptocurrency instead.
    #FiatCurrency; // Clasified as stablecoins.
    // XRC doesn't support these two types yet.
    // TODO: Implement these types and account for stablecoins.
    // #Token;
    // #StableCoin;
  };

  // Defines type for an asset.
  public type AssetType = {
    symbol : Text;
    variant : AssetClass;
  };

  public let Assets : [AssetType] = [
    { symbol = "AVAX"; variant = #Cryptocurrency },
    { symbol = "BTC"; variant = #Cryptocurrency },
    { symbol = "ETH"; variant = #Cryptocurrency },
    { symbol = "ICP"; variant = #Cryptocurrency },
    { symbol = "SOL"; variant = #Cryptocurrency },
    { symbol = "USD"; variant = #FiatCurrency },
    { symbol = "USDC"; variant = #FiatCurrency },
    { symbol = "USDT"; variant = #FiatCurrency },
    { symbol = "XDC"; variant = #Cryptocurrency },
    { symbol = "XLM"; variant = #Cryptocurrency },
    { symbol = "XRP"; variant = #Cryptocurrency },
  ];

  public type Asset = {
    name : Text;
    symbol : Text;
    slug : Text;
    img_url : Text;
  };

  public type AssetPair = {
    base : Asset;
    quote : Asset;
  };
};
