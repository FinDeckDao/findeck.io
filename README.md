# FinDeckDao

In its first phase FinDeckDao is a Web3 application that helps to provide trade
decision support to people who invest in digital assets.

FinDeckDao is built on top of the Internet Computer (ICP) and integrates with
external blockchains like the XRP Ledger Network, Stellar Network, Coreum,
Casper, XinFin, Avalanche, and others.

## Domains

These domains were purchased for this project with the intention to point these
toward the dApp hosted on the ICP blockchain.

[FinDeck.Dao](https://ud.me/findeck.dao) was purchased from Unstoppable Domains
for a one time fee.

[FinDeck.io](https://findeck.io) was purchased from NameCheap.com with annual
renewal fees.

## Getting Setup

Please setup your environment using
[these instructions](https://demergent-labs.github.io/azle/get_started.html).

## Starting the App locally.

### Install the dfx command line tools for managing ICP applications

You man need to restart the terminal after running this command.

```
DFX_VERSION=0.16.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

## Start the DFX service locally.

This starts the primary tool used to create, deploy, and manage dApps on the
Internet Computer.

```
dfx start --clean --host 127.0.0.1:8000
```

## In a separate terminal in the findeck.io directory

This ensures any app dependencies are installed and then adds the code from this
repository to an ICP canister environment
([basically a WASM module](https://internetcomputer.org/docs/current/concepts/canisters-code)).

```
npm install
dfx deploy
```

## If you have problems deploying

Please see this document on
[azle deployment issues](https://demergent-labs.github.io/azle/deployment.html#common-deployment-issues).

## Obtain your application's [canisterId]

```
dfx canister id backend
```

## Understanding the Frontend

The frontend can be viewed in a web browser at
http://[canisterId].localhost:8000. It's worth noting that the front end UI is
just a set of assets to the dApp that gets delivered when the backend is called.

This works more like a classic monolithic application where all the code is
being delivered from one server (canister in this case) instead of something
that looks more modern (but not necessarily better) where a serverless function
(for secure runtime logic) might work in conjunction with object hosting for
user facing asset delivery.

## Communicate with your canister using any HTTP client library

```
curl http://[canisterId].localhost:8000/db
curl -X POST -H "Content-Type: application/json" -d "{ \"hello\": \"world\" }" http://[canisterId].localhost:8000/db/update
```
