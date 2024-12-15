export const idlFactory = ({ IDL }) => {
  const Theme = IDL.Variant({
    'Light' : IDL.Null,
    'System' : IDL.Null,
    'Dark' : IDL.Null,
  });
  const Role = IDL.Variant({ 'Administrator' : IDL.Null, 'Member' : IDL.Null });
  const CapitalGainsTaxRate = IDL.Record({
    'shortTerm' : IDL.Float64,
    'longTerm' : IDL.Float64,
  });
  const Profile = IDL.Record({
    'theme' : Theme,
    'name' : IDL.Text,
    'role' : Role,
    'capitalGainsTaxRate' : CapitalGainsTaxRate,
  });
  const Result__1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : Profile, 'err' : IDL.Text });
  return IDL.Service({
    'createProfile' : IDL.Func([Profile], [Result__1], []),
    'deleteProfile' : IDL.Func([], [Result__1], []),
    'getAllProfiles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, Profile))],
        ['query'],
      ),
    'getProfile' : IDL.Func([], [Result], ['query']),
    'init' : IDL.Func([], [], []),
    'updateProfile' : IDL.Func([Profile], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
