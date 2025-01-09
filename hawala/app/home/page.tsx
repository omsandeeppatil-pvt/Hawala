"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [recentProfiles, setRecentProfiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);

          setWalletAddress(address);
          setWalletBalance(ethers.utils.formatEther(balance));
          setError(null);

          // Example recent profiles (replace with real data from backend if available)
          setRecentProfiles([
            "0xAbc123...456",
            "0xDef789...123",
            "0xGhi456...789",
          ]);
        } catch (err) {
          setError("Failed to fetch wallet details.");
        }
      } else {
        setError("MetaMask is not installed. Please install it from https://metamask.io.");
      }
    };

    fetchWalletDetails();
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to Your Wallet</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!walletAddress ? (
        <p>Loading wallet details...</p>
      ) : (
        <div>
          <h2>Wallet Address:</h2>
          <p>{walletAddress}</p>

          <h2>Current Balance:</h2>
          <p>{walletBalance} ETH</p>

          <h2>Recent Profiles</h2>
          <ul>
            {recentProfiles.map((profile, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {profile}
              </li>
            ))}
          </ul>

          <h2>Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => navigateTo("/nft")}
              style={{
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View NFTs
            </button>
            <button
              onClick={() => navigateTo("/send-receive")}
              style={{
                padding: "10px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send/Receive Crypto
            </button>
            <button
              onClick={() => navigateTo("/buy-crypto")}
              style={{
                padding: "10px",
                backgroundColor: "#FF5722",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Buy Crypto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
