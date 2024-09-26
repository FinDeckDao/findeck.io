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

  public type Question = {
    question : Text;
    hint : Text;
  };

  // Questions to ask when performing due diligence on an asset.
  // These questions are used to determine the quality of an asset.
  // Please avoid changing the order of these questions.
  public let DUE_DILIGENCE_QUESTIONS : [Question] = [
    {
      question = "Over a reasonable amount of time, does the longer term trend show an increase?";
      hint = "Do you see higher highs and higher lows?";
    },
    {
      question = "Is the development team public?";
      hint = "Do they share their identity on Github repositories, a website, or on socials?";
    },
    {
      question = "Is the marketing team pushing information regularly to social media?";
      hint = "Can you easily find this information about the project on social media?";
    },
    {
      question = "Do they have a market they are trying to bring utility to?";
      hint = "The utility of a meme coin is gambling. The Utility of BitCoin is a Store of Value. The utility of Ethereum is code execution in smart contracts. The XRP Ledger and the Stellar network provide a place where all of the world's liquidity can be gathered. Does this project have some kind of utility that the world needs?";
    },
    {
      question = "Is there a reason for large players to enter the network and use it?";
      hint = "Note this does not necessarily mean that they will buy the tokens (this is usually a side effect). Are there compelling reasons for large institutions like governments or similar institutions to leverage the technology to their advantage?";
    },
    {
      question = "Do you agree with the goals of the project's white paper?";
      hint = "You can easily have an AI Chatbot summarize the white paper for you. Do you agree with the goals of the project?";
    },
    {
      question = "Is there something unique the network brings to the world?";
      hint = "Put another way is the new project just do all the standard things we expect like value movement, tokenization, smart contracts, and is basically just a clone of Ethereum or Bitcoin or (like the XRP Ledger or the Internet Computer) does it legitimately bring something different to the table?";
    },
    {
      question = "Is there high enough trading volume to meet your needs?";
      hint = "Higher 24 hour trading volume is better. Over 100 million is a good sign. This helps to get your orders filled and demonstrate there is enough liquidity to trade this asset easily.";
    },
    {
      question = "Is the asset listed on major exchanges?";
      hint = "Major exchanges are Uphold, Robinhood, Binance, Coinbase, Kraken, Bitfinex, Bittrex, and Huobi. If it is not listed on these exchanges, it is not a major exchange.";
    },
    {
      question = "Does the asset have a clear use case?";
      hint = "Does the asset have a clear use case that is not already being served by another asset?";
    },
  ];

  public type Answer = {
    #Yes;
    #No;
  };

  type DueDiligenceAnswers = [Answer];

  public type Asset = {
    name : Text;
    symbol : Text;
    slug : Text;
    img_url : Text;
  };

  public type AssetPair = {
    base : Asset;
    quote : Asset;
    DueDiligence : DueDiligenceAnswers;
  };
};
