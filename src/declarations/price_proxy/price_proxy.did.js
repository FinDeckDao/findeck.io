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
  const PairPrice = IDL.Record({
    'pair' : AssetPair,
    'timestamp' : IDL.Int,
    'price' : IDL.Float64,
  });
  const UnsupportedPair = IDL.Record({
    'pair' : AssetPair,
    'lastAttempt' : IDL.Int,
  });
  return IDL.Service({
    'clearUnsupportedPairs' : IDL.Func([], [], []),
    'getCacheStatus' : IDL.Func(
        [AssetPair],
        [
          IDL.Variant({
            'not_cached' : IDL.Null,
            'expired' : IDL.Null,
            'cached' : IDL.Record({
              'timestamp' : IDL.Int,
              'price' : IDL.Float64,
            }),
          }),
        ],
        ['query'],
      ),
    'getExchangeRate' : IDL.Func([AssetPair], [IDL.Opt(PairPrice)], []),
    'getUnsupportedPairs' : IDL.Func([], [IDL.Vec(UnsupportedPair)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
