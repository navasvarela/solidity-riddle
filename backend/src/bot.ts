import { ethers } from "ethers";

import OnchainRiddle from "./contracts/OnchainRiddle.json";
import contractAddr from "./contracts/contract-address.json";

require("dotenv").config();

const contractAddress = contractAddr.address;
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/"); // TODO make this configurat
// Load private key from .env
const privateKey = process.env.BOT_PRIVATE_KEY || "";

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, OnchainRiddle.abi, wallet);

// --- Riddle Storage (In-memory for simplicity, consider a database) ---
const riddles = [
  { riddle: "What has an eye, but cannot see?", answer: "needle" },
  { riddle: "What is full of holes but still holds water?", answer: "sponge" },
  // Add more riddles here!
];
let currentRiddleIndex = -1;

// --- Function to set the initial riddle ---
async function setInitialRiddle() {
  if (currentRiddleIndex === -1) {
    // Only set if no riddle is active
    currentRiddleIndex = 0;
    const riddleData = riddles[currentRiddleIndex];
    const hashedAnswer = ethers.keccak256(ethers.toUtf8Bytes(riddleData.answer));
    try {
      const tx = await contract.setRiddle(riddleData.riddle, hashedAnswer);
      await tx.wait();
      console.log("Initial riddle set!");
      // lets retrieve the riddle from the contract
      const riddleText = await contract.riddle();
      console.log("Retrieved Riddle:", riddleText);
    } catch (error) {
      console.error("Error setting initial riddle:", error);
    }
  }
}

// --- Listen for RiddleSolved events ---
async function listenForRiddleSolved() {
  contract.on("Winner", async (solver) => {
    console.log(`Riddle solved by: ${solver}`);

    // Get the next riddle
    currentRiddleIndex = (currentRiddleIndex + 1) % riddles.length;
    const riddleData = riddles[currentRiddleIndex];
    const hashedAnswer = ethers.keccak256(ethers.toUtf8Bytes(riddleData.answer));
    try {
      const tx = await contract.setRiddle(hashedAnswer);
      await tx.wait();
      console.log("New riddle set on-chain!");
    } catch (error) {
      console.error("Error setting riddle:", error);
    }
  });
}

// --- Start the bot ---
async function startBot() {
  await setInitialRiddle();
  listenForRiddleSolved();
  console.log("Bot started.  Listening for Winner events...");
}

startBot();
