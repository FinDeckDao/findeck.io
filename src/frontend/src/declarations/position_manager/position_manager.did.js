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
  const Position = IDL.Record({
    'assetPair' : AssetPair,
    'priceDate' : IDL.Int,
    'price' : IDL.Float64,
  });
  return IDL.Service({
    'addPosition' : IDL.Func([Position], [], []),
    'getPositions' : IDL.Func([], [IDL.Opt(IDL.Vec(Position))], []),
    'init' : IDL.Func([], [], []),
    'removePosition' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updatePosition' : IDL.Func([IDL.Nat, Position], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
