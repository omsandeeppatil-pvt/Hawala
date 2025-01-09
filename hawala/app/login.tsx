"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function Login() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  useEffect(() => {
    checkMetaMaskAvailability();
  }, []);

  useEffect(() => {
    // Redirect to Home if wallet is connected
    if (walletAddress) {
      router.push("/home");
    }
  }, [walletAddress, router]);

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
        <p style={{ marginTop: "1rem" }}>Connected as: <strong>{walletAddress}</strong></p>
      )}
    </div>
  );
}
