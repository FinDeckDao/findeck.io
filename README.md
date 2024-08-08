# Findeck.io

To learn more before you start working with `findeck.io`, see the following
documentation available online:

## Development Overview

It's worth taking the time to review this documentation to get an overview of the core development tool used called DFX. 

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally) to learn more about DFX `dfx`.
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install) to learn more about the DFX Version Manager `dfxvm`.

## Backend Development
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko) to learn more about language used on the backend.
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual) as a quick reference for language basics. 

## Frontend Development
- [React Developer Documentation](https://react.dev/) is the core frontend technology being used on this project.
- [Vite](https://vitejs.dev/) is the specific implementation of React.
- [Vitest](https://vitest.dev/) is the testing framework used for the frontend.
- [Internet Identity Auth Client](https://forum.dfinity.org/t/new-package-dfinity-use-auth-client/33947) used to authenticate with the IC.

## Join the Conversation

The group building this project can be reached here on the [FindeckDao OpenChat](https://oc.app/community/vmoft-nqaaa-aaaar-bh3pa-cai/?ref=ex43p-lqaaa-aaaar-bal2q-cai). 

Following the next two steps makes it easier to interact with the rest of the group. Because it helps us all to understand that work is being done, we encourage everyone to share updates on completed work gets posted in our chat.
- Please use an [Internet Identity](https://identity.ic0.app/) to sign into OpenChat (this ensures you can get notifications easily when installing the dApp to your mobile's home screen). Using other options (Ethereum or Email for example) makes it impossible for the dApp to send you notifications (because some of these methods don't have permissions to grant permissions for notifications).
- Please add the chat dApp to your mobile device's home screen and enable notifications.

## System Dependencies for Development

***NOTE:***
These notes assume MacOS as the development environment. If you want to develop on a different platform please share notes on how to do it for others here once you understand the process.

### Git

Please be sure git is installed.
```zsh
brew install git
```

Check to be sure nvm is installed correctly.
```zsh
git --version
```

You should see a value equal to or greater than `git version 2.46.0`.

### Node Version Manager

Please install node version manager.
```zsh
brew install nvm
```

Check to be sure nvm is installed correctly.
```zsh
nvm --version
```

You should see a value equal to or greater than `0.40.0`.

### NodeJS
Please install the latest stable version of NodeJS.

```zsh
nvm install stable
```

Check to be sure NodeJS is installed correctly.
```zsh
node --version
```

You should see a value equal to or greater than `v22.6.0`.

### Motoko Development Server

Please install motoko development server globally. If you need more information, here are some docs related the [motoko development server](https://internetcomputer.org/blog/features/motoko-dev-server#continuous-integration).

```zsh
npm install -g mo-dev
```

Check to be sure mo-de is installed correctly.
```zsh
mo-dev --version
```

You should see a value equal to or greater than `mo-dev 0.13.0`.

## Clone Repository

Clone this repository to a directory on your local machine (usually `~/Repos`).
```zsh
cd ~/Repos
git clone git@github.com:FinDeckDao/findeck.io.git
```

Confirm this was done correctly buy entering the repository.
```zsh
cd findeck.io
ls -alh
```

You should see a listing that contains a file named `package.json`.

## Install Dependencies

Run the dependency installer.
```zsh
npm install
```

Confirm this was completed successfully.
```zsh
npm ls
```

You should see a tree output that looks something like this.
```
findeck.io@ /Users/<YourUserName>/Repos/findeck.io
├── @testing-library/user-event@14.5.2 extraneous
├── async@3.2.5 extraneous
... 
├─┬ frontend@0.0.0 -> ./src/frontend
│ ├── @dfinity/agent@1.4.0
...
```

## Running Project Locally

### Start a local environment similar to the InternetComputer in a Terminal.
In a Terminal Tab - From the root directory (it should be findeck.io) start up the canister environment.
This environment is similar to a docker container (but it is not powered by docker).

The following command runs the script called "dfx" inside of `package.json`.

```zsh
npm run dfx
```

Confirm this went correctly by checking the output. You should end up with something that looks like this. But the port number will likely be different.
```
npm run dfx

> dfx
> dfx start --clean --host 127.0.0.1:8000

Running dfx start for version 0.20.1
Using project-specific network 'local' defined in /Users/jfgrissom/Repos/findeck.io/dfx.json
Initialized replica.
Dashboard: http://localhost:52554/_/dashboard
```

Got to the dashboard (in the above example `http://localhost:52554/_/dashboard`) and you should see a webpage that looks like a basic dashboard has an empty area for running canisters.

### Compile and Deploy the existing canisters.
In second Terminal Tab - From the root directory (it should be findeck.io) deploy the containers.

Once the job completes, your application will be available at
`http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid
interface with

```zsh
npm run generate
```

at any time. This is recommended before starting the frontend development
server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```zsh
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to
the replica at port 4943.

### Note on Frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to
make one of the following adjustments to ensure your project does not fetch the
root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the
  autogenerated declarations
  - Setting
    `canisters -> {asset_canister_id} -> declarations -> env_override to a string`
    in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the
    autogenerated declarations
- Write your own `createActor` constructor
