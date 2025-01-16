import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { ethers } from "ethers";

interface StatCardProps {
  amount: string;
  label: string;
  trend?: number;
}

interface StatsGridProps {
  stats?: StatCardProps[] | null;
  isLoading?: boolean;
}

// ERC20 ABI for token interactions
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const StatsCard = ({ amount, label, trend = 0 }: StatCardProps) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold mt-1">
          {Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
          })}
        </h3>
      </div>
      {trend !== 0 && (
        <div
          className={`flex items-center ${
            trend > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm ml-1">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-full">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

const StatsGridWithMetaMask = () => {
  const [stats, setStats] = useState<StatCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const contractAddresses = [
    '0xfD4eCAfDFd435cd23E90Da010E3E8b4e791A3D21',
    '0x455e53cbb86018ac2b8092fdcd39d8444affc3f6'
  ];

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      setIsConnected(true);
      await fetchBalances(provider, accounts[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalances = async (provider: ethers.BrowserProvider, userAddress: string) => {
    try {
      const balancePromises = contractAddresses.map(async (contractAddress) => {
        const contract = new ethers.Contract(
          contractAddress,
          ERC20_ABI,
          provider
        );

        const [balance, decimals, symbol] = await Promise.all([
          contract.balanceOf(userAddress),
          contract.decimals(),
          contract.symbol()
        ]);

        return {
          label: `${symbol} Balance`,
          amount: ethers.formatUnits(balance, decimals),
          trend: 0
        };
      });

      const balances = await Promise.all(balancePromises);
      setStats(balances);
    } catch (err) {
      setError('Failed to fetch token balances');
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <Wallet className="w-12 h-12 text-gray-400 mb-4" />
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'Connect MetaMask'}
        </button>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <StatsCard
          key={i}
          amount={stat.amount}
          label={stat.label}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default StatsGridWithMetaMask;