import XRC "canister:xrc";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Asset "modules/Asset";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import ExchangeRate "main";

// Mocking XRC canister for testing purposes.
actor class MockXRC() : XRC.XRC {
  public func get_exchange_rate(request : XRC.GetExchangeRateRequest) : async XRC.GetExchangeRateResult {
    if (request.base_asset.symbol == "BTC" and request.quote_asset.symbol == "USD") {
      return #Ok({
        rate = Nat64.fromNat(30000000000); // Example rate
        metadata = {
          decimals = 8;
          base_asset = request.base_asset;
          quote_asset = request.quote_asset;
        };
      });
    } else {
      return #Err(#NotFound);
    };
  };
};

actor TestExchangeRate {

  // Dependency Injection for testing
  let exchangeRate = ExchangeRate({
    XRC = MockXRC();
  });

  // Helper function for assertions
  func assertEqual(actual : Float, expected : Float, message : Text) {
    if (actual != expected) {
      Debug.print("Assertion Failed: " # message # " Expected: " # Float.toText(expected) # ", Actual: " # Float.toText(actual));
      assert (false);
    } else {
      Debug.print("Assertion Passed: " # message);
    };
  };

  public func runTests() : async () {
    // Test Case 1: Valid BTC to USD conversion
    let result1 = await exchangeRate.get_exchange_rate("BTC", "USD");
    assertEqual(result1, 30000.0, "Test Case 1");

    // Test Case 2: Unsupported currency pair
    let result2 = await exchangeRate.get_exchange_rate("ETH", "USD");
    assertEqual(result2, 0.0, "Test Case 2");

    Debug.print("All test cases passed.");
  };
};

// Run the tests
TestExchangeRate.runTests();
