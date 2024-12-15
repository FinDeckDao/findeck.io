export const idlFactory = ({ IDL }) => {
  const AssetVariant = IDL.Variant({
    'Cryptocurrency' : IDL.Null,
    'FiatCurrency' : IDL.Null,
  });
  const Asset = IDL.Record({
    'img_url' : IDL.Text,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'variant' : AssetVariant,
    'symbol' : IDL.Text,
  });
  const AssetPair = IDL.Record({ 'base' : Asset, 'quote' : Asset });
  const TradeType = IDL.Variant({ 'buy' : IDL.Null, 'sell' : IDL.Null });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Trade = IDL.Record({
    'tradeType' : TradeType,
    'quoteAssetAmount' : IDL.Float64,
    'createdAt' : IDL.Int,
    'baseAssetAmount' : IDL.Float64,
    'assetPair' : AssetPair,
    'tradeDateTime' : IDL.Int,
    'deletedAt' : IDL.Opt(IDL.Int),
  });
  const Result_1 = IDL.Variant({ 'ok' : Trade, 'err' : IDL.Text });
  return IDL.Service({
    'createTrade' : IDL.Func(
        [AssetPair, IDL.Float64, IDL.Float64, TradeType, IDL.Opt(IDL.Int)],
        [Result_2],
        [],
      ),
    'deleteTrade' : IDL.Func([IDL.Nat], [Result], []),
    'getTotalTrades' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserTrades' : IDL.Func([], [IDL.Vec(Trade)], ['query']),
    'readTrade' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'updateTrade' : IDL.Func(
        [IDL.Nat, IDL.Opt(IDL.Float64), IDL.Opt(IDL.Float64)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
