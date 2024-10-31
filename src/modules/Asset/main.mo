// This module defines all the data types and functions required to manage assets.
module AssetModule {
  // Defines variants for the different asset classes that are supported by XRC.
  public type AssetVariant = {
    #Cryptocurrency;
    #FiatCurrency;
  };

  public type Asset = {
    name : Text;
    symbol : Text;
    slug : Text;
    img_url : Text;
    variant : AssetVariant;
  };

  public type AssetPair = {
    base : Asset;
    quote : Asset;
  };
};
