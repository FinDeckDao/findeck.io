import AssetModule "../modules/Asset/main";
import HashMap "mo:base/HashMap";

module {
  public type Question = {
    id : Int;
    question : Text;
    hint : Text;
  };

  // Questions to ask when performing due diligence on an asset.
  // These questions are used to determine the quality of an asset.
  // Please avoid changing the id of these questions.
  // They map to the answers in the DueDiligenceAnswers type.
  public let DUE_DILIGENCE_QUESTIONS : [Question] = [
    {
      id = 1;
      question = "Over a reasonable amount of time, does the longer term trend show an increase?";
      hint = "Looking back from the current price, do you see higher highs and higher lows?";
    },
    {
      id = 2;
      question = "Is the development team public about their activites?";
      hint = "Do they share their identity, Github repositories, a website, or have a social
      media presence?";
    },
    {
      id = 3;
      question = "Is the marketing team pushing information regularly to social media?";
      hint = "Can you easily find this information about the project on social media?";
    },
    {
      id = 4;
      question = "Do they have a market they are trying to bring utility to?";
      hint = "The utility of a meme coin is fun (maybe a bit of gambling
      is a store of value. The utility of Ethereum is code execution in smart contracts.
      The XRP Ledger and the Stellar network provide places where all of the world's
      liquidity can be shared regardless of the asset. Does this project have some kind
      of utility that the world needs?";
    },
    {
      id = 5;
      question = "Is there a reason for large players to enter the network and use it?";
      hint = "Note this does not necessarily mean that they will buy the asset (buying the
      asset is usually a side effect though). Are there compelling reasons for large
      institutions like governments, non govermental organizations, or similar institutions
      to leverage the technology to their advantage?";
    },
    {
      id = 6;
      question = "Do you agree with the goals of the project's white paper?";
      hint = "You can easily have an AI Chatbot summarize the white paper for you. Do you
      agree with the goals of the project?";
    },
    {
      id = 7;
      question = "Is there something unique the network brings to the world?";
      hint = "Put another way, does this project just do all the standard things we expect like
      value movement, tokenization, smart contracts, and is basically just a clone of Ethereum
      or Bitcoin or does it legitimately bring something different to the table (like the XRP
      Ledger or the Internet Computer)?";
    },
    {
      id = 8;
      question = "Is there high enough trading volume to meet your needs?";
      hint = "Higher 24 hour trading volume is better. Over 100 million is a good sign. This helps
      to get your orders filled and demonstrate there is enough liquidity to trade this asset easily.";
    },
    {
      id = 9;
      question = "Is the asset listed on major exchanges?";
      hint = "Major exchanges are the Stellar DEX, the XRPL DEX, Uphold, Robinhood, Binance, Coinbase,
      Kraken, Bitfinex, Bittrex, and Huobi. If it is not listed on these kinds of exchanges, it is
      probably not a major exchange.";
    },
    {
      id = 10;
      question = "Does the asset have a clear use case?";
      hint = "Does the asset have a clear use case that is not already being served by another asset?";
    },
  ];

  public type Answer = {
    #Yes;
    #No;
  };

  public type DueDiligenceAnswers = [Answer];

  public type WishlistItem = {
    base : AssetModule.Asset;
    DueDiligence : DueDiligenceAnswers;
  };

  public type WishlistItems = HashMap.HashMap<Principal, [WishlistItem]>;

};
