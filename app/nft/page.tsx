"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

// Define proper types for Ethereum and other interfaces
declare global {
  interface Ethereum {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    isMetaMask?: boolean;
  }
  interface Window {
    ethereum?: Ethereum;
  }
}

interface NFT {
  id: number;
  name: string;
  price: number; // Price in ETH
  image: string;
}

interface Notification {
  type: "error" | "success";
  message: string;
}

const MinimalNFTMarketplace = () => {
  const [nfts] = useState<NFT[]>([
    {
      id: 1,
      name: "Digital Dream #1",
      price: 0.05,
      image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/106f05162712987.63da29d7cf415.jpg",
    },
    {
      id: 2,
      name: "Cosmic Art #4",
      price: 0.12,
      image: "https://pbs.twimg.com/media/E4Z7wPQVUAQ1usn.jpg:large",
    },
    {
      id: 3,
      name: "Future Vision #7",
      price: 0.08,
      image: "https://www.adgully.com/img/800/202110/divine-x-santanu-kohinoor-nft.jpg",
    },
    {
      id: 4,
      name: "Digital Beast #2",
      price: 0.15,
      image: "https://i.pinimg.com/1200x/ef/86/75/ef8675e64dd30a32a9e772621125b41d.jpg",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
        if (accounts.length > 0) setAccount(accounts[0]);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
        if (accounts.length > 0) setAccount(accounts[0]);
        return accounts[0];
      } catch (error) {
        setNotification({
          type: "error",
          message: "Failed to connect wallet. Please try again.",
        });
      }
    } else {
      setNotification({
        type: "error",
        message: "Please install MetaMask to purchase NFTs.",
      });
    }
    return null;
  };

  const purchaseNFT = async (nft: NFT) => {
    try {
      setLoading(true);
      setBuyingId(nft.id);

      const userAccount = account || (await connectWallet());
      if (!userAccount) return;

      const priceInWei = BigInt(nft.price * 1e18).toString(16);
      const gasEstimate = BigInt(nft.price * 0.002 * 1e18).toString(16);

      const transactionParameters = {
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Replace with a valid recipient address
        from: userAccount,
        value: "0x" + priceInWei,
        gas: "0x" + gasEstimate,
      };

      const txHash = (await window.ethereum?.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })) as string;

      setNotification({
        type: "success",
        message: `Successfully purchased ${nft.name}! Transaction: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`,
      });
      setSelectedNFT(null);
    } catch (error) {
      console.error("Purchase Error:", error);
      setNotification({
        type: "error",
        message: "Failed to purchase NFT. Please try again.",
      });
    } finally {
      setLoading(false);
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {notification && (
          <Alert className={`mb-4 ${notification.type === "error" ? "bg-red-50 text-red-900" : "bg-green-50 text-green-900"}`}>
            {notification.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">NFT Collection</h1>
          <Button onClick={connectWallet} disabled={!!account}>
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nfts.map((nft) => (
            <Card key={nft.id} className="overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img src={nft.image} alt={nft.name} className="w-full h-auto object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{nft.name}</h2>
                  <p className="text-lg font-medium">{nft.price} ETH</p>
                  <Button className="w-full mt-4 bg-black hover:bg-gray-800" onClick={() => purchaseNFT(nft)}>
                    {loading && buyingId === nft.id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalNFTMarketplace;
