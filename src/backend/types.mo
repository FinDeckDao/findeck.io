module {

  // Define the Role type
  public type Role = {
    #Member;
    #Administrator;
  };

  // Define the Theme Preference type
  public type Theme = {
    #Light;
    #Dark;
    #System;
  };

  // Defined capital gains tax rate
  // See: https://www.bankrate.com/investing/long-term-capital-gains-tax/#what-is-the-long-term-capital-gains-tax-rate
  public type CapitalGainsTaxRate = {
    shortTerm : Float; // 30% Default
    longTerm : Float; // 20% Default
  };

  public type Profile = {
    name : Text;
    role : Role;
    theme : Theme;
    capitalGainsTaxRate : CapitalGainsTaxRate;
  };

};
