import React from "react";
import { TrendingUp } from "lucide-react";

const StatsCard = ({
  amount,
  label,
  trend,
}: {
  amount: string;
  label: string;
  trend: number;
}) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{amount}</h3>
      </div>
      <div
        className={`flex items-center ${
          trend > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm ml-1">{Math.abs(trend)}%</span>
      </div>
    </div>
  </div>
);

const StatsGrid = ({ stats }: { stats: any[] }) => (
  <div className="grid grid-cols-2 gap-4">
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

export default StatsGrid;
