"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UIButton } from "@/components/ui/button";
import { Alerta, AlertDescriptiona } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

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
  price: number;
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
      image: "https://i.pinimg.com/1200x/ef/86/75/ef8675e64dd30a32a9e772621125b41d.jpg",
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
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
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
          <Alerta className={`mb-4 ${notification.type === "error" ? "bg-red-50 text-red-900" : "bg-green-50 text-green-900"}`}>
            {notification.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertDescriptiona>{notification.message}</AlertDescriptiona>
          </Alerta>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">NFT Collection</h1>
          <UIButton onClick={connectWallet} disabled={!!account}>
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
          </UIButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nfts.map((nft) => (
            <Card key={nft.id} className="overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <div className="relative h-96"> {/* Increased height for fuller image */}
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h2 className="text-xl font-semibold">{nft.name}</h2>
                  <p className="text-lg font-medium">{nft.price} ETH</p>
                  <UIButton 
                    className="w-full mt-4 bg-white text-black hover:bg-gray-200" 
                    onClick={() => purchaseNFT(nft)}
                  >
                    {loading && buyingId === nft.id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      "Buy Now"
                    )}
                  </UIButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalNFTMarketplace;