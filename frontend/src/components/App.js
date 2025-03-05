import OnchainRiddle from "../contracts/OnchainRiddle.json";
import contract from "../contracts/contract-address.json";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";

const contractAddress = contract.address;
const contractABI = OnchainRiddle.abi;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [riddleText, setRiddleText] = useState("Loading riddle...");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Wallet Connection ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        setWalletAddress(await newSigner.getAddress());
        console.log("Wallet connected:", await newSigner.getAddress());
      } catch (error) {
        console.error("User denied account access or error connecting:", error);
        setMessage("Error connecting wallet.");
      }
    } else {
      console.error("No Ethereum browser extension detected");
      setMessage("Please install MetaMask or another Ethereum wallet.");
    }
  };

  // --- Fetch Riddle Text from Contract ---
  const fetchRiddleText = async () => {
    try {
      const riddleText = await contract.riddle();
      setRiddleText(riddleText);
      console.log("Riddle text fetched:", riddleText);
    } catch (error) {
      console.error("Error fetching riddle from contract:", error);
      setMessage("Error loading riddle.");
    }
  };

  useEffect(() => {
    if (contract) {
      fetchRiddleText();
    }
  }, [contract]);

  // --- Answer Submission ---
  const submitAnswer = async () => {
    if (!answer) {
      setMessage("Please enter an answer.");
      return;
    }
    if (!contract) {
      setMessage("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear previous messages
    try {
      const hashedAnswer = ethers.keccak256(ethers.toUtf8Bytes(answer));
      console.log("Hashed Answer:", hashedAnswer);

      const tx = await contract.submitAnswer(hashedAnswer);
      console.log("Transaction sent:", tx.hash);
      setMessage("Transaction sent. Waiting for confirmation...");

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      if (receipt.status === 1) {
        setMessage("Correct! Waiting for the next riddle...");
        setAnswer(""); // Clear the answer input
      } else {
        setMessage("Incorrect answer. Try again.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setMessage("Error submitting answer. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Riddle Game</h1>
      {!walletAddress && <button onClick={connectWallet}>Connect Wallet</button>}
      {walletAddress && (
        <div>
          <p>Wallet: {walletAddress}</p>
          <p id="riddle-text">{riddleText}</p>

          <input
            type="text"
            placeholder="Enter your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={loading}
          />
          <button onClick={submitAnswer} disabled={loading}>
            Submit Answer
          </button>
          {loading && <p>Loading...</p>}
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export { App };
