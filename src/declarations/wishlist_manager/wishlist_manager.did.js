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
  const Answer = IDL.Variant({ 'No' : IDL.Null, 'Yes' : IDL.Null });
  const DueDiligenceAnswers = IDL.Vec(Answer);
  const WishlistItem = IDL.Record({
    'base' : Asset,
    'DueDiligence' : DueDiligenceAnswers,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Question = IDL.Record({
    'id' : IDL.Int,
    'question' : IDL.Text,
    'hint' : IDL.Text,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Vec(WishlistItem),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'createWishlistItem' : IDL.Func([WishlistItem], [Result], []),
    'deleteWishlistItem' : IDL.Func([WishlistItem], [Result], []),
    'getDueDiligenceQuestions' : IDL.Func([], [IDL.Vec(Question)], ['query']),
    'getTopWatchedAssets' : IDL.Func([], [IDL.Vec(WishlistItem)], ['query']),
    'getUserWishlist' : IDL.Func([], [IDL.Vec(WishlistItem)], []),
    'getWishlistItem' : IDL.Func([], [Result_1], []),
    'init' : IDL.Func([], [], []),
    'listAllWishlistItems' : IDL.Func([], [IDL.Vec(WishlistItem)], ['query']),
    'updateWishlistItem' : IDL.Func([WishlistItem], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
