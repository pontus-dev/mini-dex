# Solidity mini dex challenge in TypeScript

## What is this?

This is a challenge I did for my portfolio where I build a decentralized exchange. The challenge is a [speedrunethereum](https://speedrunethereum.com) challenge. I used [scaffold-eth-typescript](https://github.com/scaffold-eth/scaffold-eth-typescript) from the [buidlguidl](https://buidlguidl.com) as a starting template for the project. I also converted all the JavaScript needed into TypeScript for the challenge from [here](https://github.com/squirtleDevs/scaffold-eth/blob/challenge-3-single-pool-dex/packages/hardhat/test/steveTest.js). This includes app specific react components, testing and hardhat deployment scripts.
I also grabbed the bare bones (only contains empty functions and events) DEX.sol contract that goes along with that test [here](https://github.com/squirtleDevs/scaffold-eth/blob/challenge-3-single-pool-dex/packages/hardhat/contracts/DEXTemplate.sol).

## Quick Start

Running the app

1. install your dependencies

   ```bash
   yarn install
   ```

2. start a hardhat node

   ```bash
   yarn chain
   ```

3. run the app, `open a new command prompt`

   ```bash
   # build hardhat & external contracts types
   yarn contracts:build
   # deploy your hardhat contracts
   yarn deploy
   # start vite
   yarn start
   ```

<!--
## Overview

Everything you need to build on Ethereum! 🚀 Quickly experiment with Solidity using a frontend that adapts to your smart contract:

![image](https://user-images.githubusercontent.com/2653167/124158108-c14ca380-da56-11eb-967e-69cde37ca8eb.png)

- 🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat-ts/contracts`
- 📝 Edit your frontend `MainPage.jsx` in `packages/vite-app-ts/src`
- 💼 Edit your deployment scripts in `packages/hardhat-ts/deploy`
- 📱 Open http://localhost:3000 to see the app

## More Information!

### 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

Eth-hooks documentation is [here](https://scaffold-eth.github.io/eth-hooks/). Learn how to use the contexts here.

### 🔭 Learning Solidity

Read the docs: https://docs.soliditylang.org

Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **🏗 scaffold-eth**

### 🏃💨 Speedrun Ethereum

Register as a builder [here](https://speedrunethereum.com) and start on some of the challenges and build a portfolio.

### 🛠 Buidl

Check out all the [active branches](https://github.com/austintgriffith/scaffold-eth/branches/active), [open issues](https://github.com/austintgriffith/scaffold-eth/issues), and join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!

[Follow the full Ethereum Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c)

### 💌 P.S.

You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

### 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

### 🙏🏽 Support us!

Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
