"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function LoginWithMetaMask() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
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
      setError(null);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setError(null);
  };

  useEffect(() => {
    checkMetaMaskAvailability();
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center", padding: "2rem" }}>
      <h1>Login with MetaMask</h1>
      {!walletAddress ? (
        <>
          <button
            onClick={connectWallet}
            style={{
              padding: "1rem 2rem",
              backgroundColor: "#f6851b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
          >
            Connect MetaMask
          </button>
          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </>
      ) : (
        <>
          <p style={{ marginTop: "1rem" }}>Connected as: <strong>{walletAddress}</strong></p>
          <button
            onClick={disconnectWallet}
            style={{
              padding: "1rem 2rem",
              backgroundColor: "#ccc",
              color: "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
          >
            Disconnect Wallet
          </button>
        </>
      )}
    </div>
  );
}
