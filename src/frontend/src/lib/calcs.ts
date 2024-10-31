import {
  Trade,
  AssetPair,
} from "../../../declarations/trade_manager/trade_manager.did";

// The goal of this module is to handle calculations:
// 1. ROI
// 2. Total Holdings
// 3. Amount Invested
// 4. Total Amount Sold
// 5. Total Amount Bought
// 6. Moon Bag: AKA Risk Free Position (sellAmount = (initialInvestment) / (currentPrice))
// 7. Cost Basis
// 8. Total at Risk (this value changes with price changes)
// 9. Total Position Value.

// Cost Basis
export const calculateCostBasis = (amountHeld: number, amountSpent: number) => {
  return amountSpent / amountHeld;
};

interface AssetHoldings {
  symbol: string;
  totalBought: number;
  totalSold: number;
  currentHoldings: number;
}

// Calculates the equality of the asset pair based on the base and quote symbols
export const isAssetPairEqual = (a: AssetPair, b: AssetPair): boolean => {
  return a.base.symbol === b.base.symbol && a.quote.symbol === b.quote.symbol;
};

// Barfs on a 0 trade array (as if to say how did we receive this?).
export const validateTrades = (trades: Trade[]): void => {
  if (trades.length === 0) {
    throw new Error("The trades array is empty");
  }

  const firstAssetPair = trades[0].assetPair;
  const allAssetPairsEqual = trades.every((trade) =>
    isAssetPairEqual(trade.assetPair, firstAssetPair)
  );

  if (!allAssetPairsEqual) {
    throw new Error("Not all asset pairs in the trades array are the same");
  }
};

// Calculate the total holdings.
export const calculateHoldings = (trades: Trade[]): AssetHoldings => {
  let totalBought = 0;
  let totalSold = 0;

  trades.forEach((trade) => {
    if ("buy" in trade.tradeType) {
      totalBought += trade.baseAssetAmount;
    } else if ("sell" in trade.tradeType) {
      totalSold += trade.baseAssetAmount;
    }
  });

  const currentHoldings = totalBought - totalSold;

  return {
    symbol: trades[0].assetPair.base.symbol,
    totalBought,
    totalSold,
    currentHoldings,
  };
};

// Handle the complete job.
export const validateAndCalculateHoldings = (
  trades: Trade[]
): AssetHoldings => {
  validateTrades(trades);
  return calculateHoldings(trades);
};

// Calculate the total holdings.
export const calculateTotalSpent = (trades: Trade[]): number => {
  let totalBought = 0;
  let totalSold = 0;

  trades.forEach((trade) => {
    if ("buy" in trade.tradeType) {
      totalBought += trade.quoteAssetAmount;
    } else if ("sell" in trade.tradeType) {
      totalSold += trade.quoteAssetAmount;
    }
  });

  const amountSpent = totalBought - totalSold;
  return amountSpent;
};

// Handle the complete job.
export const validateAndCalculateTotalSpent = (trades: Trade[]): number => {
  validateTrades(trades);
  return calculateTotalSpent(trades);
};

// Filter the trades based on their corresponding AssetPair
export const filteredTradesByAssetPair = (
  trades: Trade[],
  assetPair: AssetPair
) => {
  return trades.filter(
    (trade) =>
      trade?.assetPair.base.symbol === assetPair?.base.symbol &&
      trade?.assetPair?.quote.symbol === assetPair?.quote.symbol
  );
};

export const formatCryptoAmount = (
  amount: number,
  decimalPlaces: number = 2
) => {
  try {
    // Use Intl.NumberFormat for formatting
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    return formatter.format(amount);
  } catch (error) {
    console.error("Error formatting amount:", error);
    return "Invalid Amount";
  }
};

// Total Position Value
export const calculateTotalPositionValue = (
  currentPrice: number,
  totalHeld: number
) => {
  return currentPrice * totalHeld;
};
