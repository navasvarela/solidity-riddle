# Take-home Riddle application

NOTE: I haven't been able to finish the project to deploy to Vercel so the demo is only available to be run locally using hardhat. 

## Overview

This repository implements the take home exercise detailed in https://zamaai.notion.site/Challenge-On-chain-Riddle-1975a7358d5e80279c2de1c1af608610 

The purpose of the exercise is to implement a simple game where the player has to solve a riddle.

A bot proposes the initial riddle and a new one every time the player successfully guesses the riddle. 

The riddles are stored in a smart contract. 

I forked and modified the repo https://github.com/poppyseedDev/solidity-riddle. This repo contains the implementation of
the smart contract as well as some useful hardhat settings.

I added two folders, one for the [frontend](frontend) and one for the [backend](backend).

The frontend is a simple react application that implements the web UI. 

The backend provides the implementation of the bot. 

## Installation

First, you need to install the dependencies:

```sh
pnpm install
```

## Using a local hardhat

For local testing it is convenient to use a local hardhat network. 

We need to follow these steps:
1. Start the node running `npx hardhat node` or `pnpm run start:local`
2. Deploy the smart contract: `pnpm run deploy:local`
3. Start the bot: `pnpm run start:bot`
4. Start the frontend: `pnpm run start:frontend`


The deployment script generates configuration variables that both the bot and the frontend can use to connect to the contract, such as:
- Contract ABI
- Contract Address

### Configure Metamask browser extension 

I found this article useful: https://medium.com/@kaishinaw/connecting-metamask-with-a-local-hardhat-network-7d8cea604dc6

We need to add a new network to Metamask, using the local RPC URL: http://127.0.0.1:8545/.

Then we should use one of the funded accounts that are displayed at the beginning of the node execution. By importing an account, copying one of the private keys provided. 


