"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const router = useRouter();

  // Check if MetaMask is available
  const checkMetaMaskAvailability = () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install it from https://metamask.io.");
    }
  };

  // Connect MetaMask Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not available.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request wallet connection
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address); // Save wallet address

      // Get wallet balance
      const balance = await provider.getBalance(address);
      setWalletBalance(ethers.utils.formatEther(balance));

      setError(null);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  // Send Ether
  const sendEther = async () => {
    if (!recipient || !amount) {
      setError("Please provide recipient address and amount.");
      return;
    }

    try {
      if (!window.ethereum) {
        setError("MetaMask is not available.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
      });

      setTxHash(tx.hash);
      setError(null);
    } catch (err) {
      setError("Failed to send Ether.");
    }
  };

  // Redirect to Login page if not logged in
  useEffect(() => {
    if (!walletAddress) {
      router.push("/login");
    }
  }, [walletAddress, router]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "2rem" }}>
      <h1>Home - Crypto Wallet</h1>

      <p style={{ marginTop: "1rem" }}>
        Connected as: <strong>{walletAddress}</strong>
      </p>
      <p>Balance: {walletBalance} ETH</p>

      <button
        onClick={connectWallet}
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          marginTop: "1rem",
        }}
      >
        Connect Wallet
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h2>Send Ether</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <input
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button
          onClick={sendEther}
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Send Ether
        </button>
        {txHash && <p style={{ marginTop: "1rem", color: "green" }}>Transaction Hash: {txHash}</p>}
      </div>
    </div>
  );
}
