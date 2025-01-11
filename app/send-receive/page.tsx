"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function SendReceive() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
          setError(null);
        } catch (err) {
          setError("Failed to fetch wallet address. Ensure MetaMask is connected.");
        }
      } else {
        setError("MetaMask is not installed. Please install it from https://metamask.io.");
      }
    };

    fetchWalletAddress();
  }, []);

  const handleSendCrypto = async () => {
    if (!recipientAddress || !amount) {
      setError("Recipient address and amount are required.");
      return;
    }

    if (!walletAddress) {
      setError("Connect to your wallet first.");
      return;
    }

    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Sending transaction
        const tx = await signer.sendTransaction({
          to: recipientAddress,
          value: ethers.utils.parseEther(amount),
        });

        setTransactionStatus(`Transaction sent! Tx Hash: ${tx.hash}`);
        setError(null);
      } else {
        setError("MetaMask is not installed.");
      }
    } catch (err: any) {
      setError(`Transaction failed: ${err.message}`);
      setTransactionStatus(null);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Send/Receive Crypto</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!walletAddress ? (
        <p>Loading wallet details...</p>
      ) : (
        <div>
          <h2>Your Wallet Address:</h2>
          <p>{walletAddress}</p>

          <h3>Receive Crypto</h3>
          <p>Share the above wallet address to receive crypto.</p>

          <hr style={{ margin: "20px 0" }} />

          <h3>Send Crypto</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Recipient Wallet Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <input
              type="number"
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={handleSendCrypto}
              style={{
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>

          {transactionStatus && (
            <p style={{ marginTop: "20px", color: "green" }}>{transactionStatus}</p>
          )}
        </div>
      )}
    </div>
  );
}
