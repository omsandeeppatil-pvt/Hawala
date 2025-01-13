"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

// Define types
interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: string;
  image: string;
}

const CryptoTrading: React.FC = () => {
  const [cryptos] = useState<CryptoData[]>([
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      price: 4380000,
      change: "+2.4",
      image: "/api/placeholder/32/32"
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      price: 230000,
      change: "+1.8",
      image: "/api/placeholder/32/32"
    },
    {
      id: 3,
      name: "Solana",
      symbol: "SOL",
      price: 7800,
      change: "+4.2",
      image: "/api/placeholder/32/32"
    },
    {
      id: 4,
      name: "Polygon",
      symbol: "MATIC",
      price: 80,
      change: "-0.5",
      image: "/api/placeholder/32/32"
    }
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [amount, setAmount] = useState<string>('');

  const handleCryptoClick = (crypto: CryptoData) => {
    if (selectedCrypto?.id === crypto.id) {
      setSelectedCrypto(null);
      setAmount('');
    } else {
      setSelectedCrypto(crypto);
      setAmount('');
    }
  };

  const buyCrypto = async (): Promise<void> => {
    if (!selectedCrypto) return;
    
    try {
      setLoading(true);

      if (!window?.ethereum?.isMetaMask) {
        alert('Please install MetaMask to purchase crypto');
        return;
      }

      await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Simulate purchase delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Successfully bought ${amount} ${selectedCrypto.symbol}!`);
      
      // Reset after purchase
      setSelectedCrypto(null);
      setAmount('');

    } catch (err) {
      console.error('Purchase Error:', err);
      alert('Failed to purchase crypto. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Buy Cryptocurrency</h1>

        <div className="space-y-3">
          {cryptos.map((crypto) => (
            <Card 
              key={crypto.id} 
              className={`bg-white cursor-pointer transition-colors ${selectedCrypto?.id === crypto.id ? 'ring-2 ring-black' : 'hover:bg-gray-50'}`}
              onClick={() => handleCryptoClick(crypto)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={crypto.image} 
                      alt={crypto.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold">{crypto.name}</h2>
                      <p className="text-sm text-gray-500">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-semibold">₹{crypto.price.toLocaleString()}</p>
                      <p className={`text-sm flex items-center justify-end ${crypto.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {crypto.change}%
                      </p>
                    </div>
                    {selectedCrypto?.id === crypto.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {selectedCrypto?.id === crypto.id && (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder={`Amount of ${crypto.symbol}`}
                        className="flex-1 px-3 py-2 border rounded-md"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      />
                      <Button 
                        className="bg-black hover:bg-gray-800 px-6"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          buyCrypto();
                        }}
                        disabled={loading || !amount}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Buying...
                          </span>
                        ) : (
                          'Buy'
                        )}
                      </Button>
                    </div>
                    {amount && (
                      <p className="text-sm text-gray-500 text-right">
                        Total: ₹{(crypto.price * parseFloat(amount)).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Click on a cryptocurrency to buy
        </p>
      </div>
    </div>
  );
};

export default CryptoTrading;