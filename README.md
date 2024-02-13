# FinDeckDao

It its first phase FinDeckDao is a Web3 application that helps to provide trade
decision support to people who invest in digital assets.

## Getting Setup

Please setup your environment using
[these instructions](https://demergent-labs.github.io/azle/get_started.html).

## Starting the App locally.

### The dfx command line tools for managing ICP applications

```
DFX_VERSION=0.16.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
dfx start --clean --host 127.0.0.1:8000
```

### In a separate terminal in the hello_world directory

```
npm install
dfx deploy
```

### If you have problems deploying see https://demergent-labs.github.io/azle/deployment.html#common-deployment-issues

### Obtain your application's [canisterId]

```
dfx canister id backend
```

### View your frontend in a web browser at http://[canisterId].localhost:8000

### Communicate with your canister using any HTTP client library

```
curl http://[canisterId].localhost:8000/db
curl -X POST -H "Content-Type: application/json" -d "{ \"hello\": \"world\" }" http://[canisterId].localhost:8000/db/update
```
