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

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const StatsCard: React.FC<StatCardProps> = ({ amount, label, trend = 0 }) => (
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

const LoadingSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-full">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

const StatsGrid: React.FC<StatsGridProps> = ({ stats = [], isLoading = false }) => {
  // Ensure stats is always an array
  const safeStats = Array.isArray(stats) ? stats : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (safeStats.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No stats available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {safeStats.map((stat, index) => (
        <StatsCard
          key={index}
          amount={stat.amount}
          label={stat.label}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
