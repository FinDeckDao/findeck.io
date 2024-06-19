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

## Add DFX Version Manager

Run this command and follow the prompts.

```
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

Be sure to add the environment configuration changes it tells you to.

Restart your terminal.

## Confirm DFX Version Manager is working as expected.

Run this command and review the item that is set to default.

```
dfxvm list
```

The default should be set to the latest version and look something like this.

```
% dfxvm list
0.16.1
0.18.0
0.20.1 (default)
```

If you see this it's setup correctly.

## Install Podman

Run this command to install podman and the desktop manager (which is an
environmental dependency for dfx builds).

```
brew install podman
brew install podman-desktop
```

## Start the DFX service locally

Starts the primary tool used to create, deploy, and manage dApps on the Internet
Computer.

```
dfx start --clean --host 127.0.0.1:8000
```

Running this will present you with a WebBased Dashboard at a url (likely with a
different port number) that looks similar to
`http://localhost:52733/_/dashboard`. This is an environment similar to the IC
but running locally for development purposes.

Using this you can see data related to the canisters deployed.

It's helpful to leave this running while you're doing development work.

## In a separate terminal in the findeck.io directory

Ensures any app dependencies are installed and then adds the code from this
repository to an ICP canister environment
([basically a WASM module](https://internetcomputer.org/docs/current/concepts/canisters-code)).

```
npm install
dfx canister create install-dfx-extension
npx azle install-dfx-extension
npm run deploy:local
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

## Developer Notes

The Positions are handled with 3 layers. TODO: Make these into 3 reusable
packages.

1. The Component Layer that reads or mutates the Positions.
2. The Context Layer where the Positions are being used in the runtime app.
   1. Retrieves from cache if something is cached.
   2. Sets and empty default state of there is no cache.
   3. Writes updates to the cache.
   4. Exports read and mutate functions.
   5. Prevents null entries from being added to or removed from the state.
   6. Orchestrates between Cache Layer and Persistence Layer for Setting and
      Getting Events.
3. The Cache Layer where the Positions are stored in local storage.
   1. Export data quickly for the user to backup their position data.
   2. Import data quickly for the user to restore their browser position data
      from a previous backup.
4. The Persistence Layer where the Positions are stored in the database.
   1. This feature is only available to paying customers.
   2. Is responsible for understanding
