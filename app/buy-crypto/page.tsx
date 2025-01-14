"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UIButton } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  StarOff
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  priceHistory: { time: string; price: number }[];
}

const CryptoTrading = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      price: 4380000,
      change: 2.4,
      volume: 28000000000,
      marketCap: 850000000000,
      priceHistory: [
        { time: "1d", price: 4300000 },
        { time: "2d", price: 4320000 },
        { time: "3d", price: 4350000 },
        { time: "4d", price: 4380000 }
      ],
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      price: 230000,
      change: -1.8,
      volume: 15000000000,
      marketCap: 270000000000,
      priceHistory: [
        { time: "1d", price: 235000 },
        { time: "2d", price: 232000 },
        { time: "3d", price: 228000 },
        { time: "4d", price: 230000 }
      ],
    }
  ]);

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({});
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [alerts, setAlerts] = useState<{ [key: string]: number }>({});
  const [view, setView] = useState<"market" | "portfolio">("market");
  const [tradeAmount, setTradeAmount] = useState("");
  const [alertPrice, setAlertPrice] = useState("");

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() * 0.002 - 0.001)),
        change: crypto.change + (Math.random() * 0.2 - 0.1)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Check price alerts
  useEffect(() => {
    cryptos.forEach(crypto => {
      const targetPrice = alerts[crypto.symbol];
      if (targetPrice && Math.abs(crypto.price - targetPrice) / targetPrice < 0.01) {
        alert(`${crypto.symbol} has reached your target price of ₹${targetPrice.toLocaleString()}`);
        const newAlerts = { ...alerts };
        delete newAlerts[crypto.symbol];
        setAlerts(newAlerts);
      }
    });
  }, [cryptos, alerts]);

  const handleCryptoSelect = (crypto: CryptoData) => {
    setSelectedCrypto(selectedCrypto?.id === crypto.id ? null : crypto);
    setTradeAmount("");
    setAlertPrice("");
  };

  const handleTrade = (type: "buy" | "sell") => {
    if (!selectedCrypto || !tradeAmount) return;
    const amount = parseFloat(tradeAmount);
    
    if (type === "buy") {
      setPortfolio(prev => ({
        ...prev,
        [selectedCrypto.symbol]: (prev[selectedCrypto.symbol] || 0) + amount
      }));
    } else {
      const currentAmount = portfolio[selectedCrypto.symbol] || 0;
      if (amount > currentAmount) {
        alert("Insufficient balance");
        return;
      }
      
      setPortfolio(prev => ({
        ...prev,
        [selectedCrypto.symbol]: currentAmount - amount
      }));
    }
    setTradeAmount("");
  };

  const handleSetAlert = () => {
    if (!selectedCrypto || !alertPrice) return;
    const price = parseFloat(alertPrice);
    
    setAlerts(prev => ({
      ...prev,
      [selectedCrypto.symbol]: price
    }));
    setAlertPrice("");
  };

  const toggleFavorite = (e: React.MouseEvent, cryptoId: number) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(cryptoId)) {
        next.delete(cryptoId);
      } else {
        next.add(cryptoId);
      }
      return next;
    });
  };

  const totalValue = Object.entries(portfolio).reduce((acc, [symbol, amount]) => {
    const crypto = cryptos.find(c => c.symbol === symbol);
    return acc + (crypto?.price || 0) * amount;
  }, 0);

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crypto Trading</h1>
        <div className="flex gap-2">
          <UIButton 
            onClick={() => setView("market")}
            className={view === "market" ? "bg-black" : "bg-gray-200"}
          >
            Market
          </UIButton>
          <UIButton 
            onClick={() => setView("portfolio")}
            className={view === "portfolio" ? "bg-black" : "bg-gray-200"}
          >
            Portfolio (₹{totalValue.toLocaleString()})
          </UIButton>
        </div>
      </div>

      {view === "market" && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 p-2 border rounded"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {filteredCryptos.map(crypto => (
              <Card 
                key={crypto.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCryptoSelect(crypto)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-bold">{crypto.name}</h3>
                        <p className="text-sm text-gray-500">{crypto.symbol}</p>
                      </div>
                      {favorites.has(crypto.id) ? (
                        <Star 
                          className="text-yellow-500 cursor-pointer" 
                          onClick={(e) => toggleFavorite(e, crypto.id)}
                        />
                      ) : (
                        <StarOff 
                          className="text-gray-400 cursor-pointer"
                          onClick={(e) => toggleFavorite(e, crypto.id)}
                        />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{crypto.price.toLocaleString()}</p>
                      <p className={crypto.change >= 0 ? "text-green-500" : "text-red-500"}>
                        {crypto.change >= 0 ? <TrendingUp className="inline mr-1" /> : <TrendingDown className="inline mr-1" />}
                        {Math.abs(crypto.change).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {selectedCrypto?.id === crypto.id && (
                    <div className="mt-4">
                      <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={crypto.priceHistory}>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#000" 
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Volume (24h)</p>
                          <p className="font-medium">₹{crypto.volume.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                          <p className="font-medium">₹{crypto.marketCap.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <input
                          type="number"
                          placeholder="Amount"
                          className="flex-1 p-2 border rounded"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <UIButton 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrade("buy");
                          }}
                        >
                          Buy
                        </UIButton>
                        <UIButton 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrade("sell");
                          }}
                        >
                          Sell
                        </UIButton>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          placeholder="Alert price"
                          className="flex-1 p-2 border rounded"
                          value={alertPrice}
                          onChange={(e) => setAlertPrice(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <UIButton 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAlert();
                          }}
                        >
                          Set Alert
                        </UIButton>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {view === "portfolio" && (
        <div className="space-y-4">
          {Object.entries(portfolio).map(([symbol, amount]) => {
            const crypto = cryptos.find(c => c.symbol === symbol);
            if (!crypto) return null;
            
            return (
              <Card key={symbol}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{crypto.name}</h3>
                      <p className="text-sm text-gray-500">
                        {amount.toFixed(4)} {symbol}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ₹{(crypto.price * amount).toLocaleString()}
                      </p>
                      <p className={crypto.change >= 0 ? "text-green-500" : "text-red-500"}>
                        {crypto.change >= 0 ? "+" : ""}{crypto.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CryptoTrading;