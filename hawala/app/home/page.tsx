"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Send,
  Wallet,
  CreditCard,
  User,
  Search,
  Plus,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Stats Card Component
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

// Search Bar Component
const SearchBar = ({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search contacts..."
      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

// Quick Action Button Component
const QuickAction = ({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<any>;
  label: string;
}) => (
  <button className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <Icon className="w-6 h-6 text-gray-600" />
    <span className="text-xs mt-1 text-gray-600">{label}</span>
  </button>
);

// Contact Avatar Component
const ContactAvatar = ({
  image = "",
  name,
  amount,
  onClick,
}: {
  image?: string;
  name: string;
  amount: string;
  onClick: () => void;
}) => (
  <div
    className="flex flex-col items-center space-y-2 cursor-pointer group"
    onClick={onClick}
  >
    <div className="relative">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-white group-hover:border-gray-200 transition-all shadow-sm">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      {amount && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 text-xs font-medium border shadow-sm">
          Rs {amount}
        </div>
      )}
    </div>
    <span className="text-sm font-medium text-gray-700">{name}</span>
  </div>
);

// Activity Item Component
const ActivityItem = ({
  name,
  amount,
  type,
  time,
}: {
  name: string;
  amount: string;
  type: "sent" | "received";
  time: string;
}) => (
  <div className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 cursor-pointer">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-5 h-5 text-gray-500" />
      </div>
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    <div className="text-right">
      <p
        className={`font-medium ${
          type === "received" ? "text-green-600" : "text-gray-900"
        }`}
      >
        {type === "received" ? "+" : "-"}Rs {amount}
      </p>
      <p className="text-xs text-gray-500">{type}</p>
    </div>
  </div>
);

// Main App Component
const PaymentApp = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);

  // Fetch data from APIs
  const fetchStats = async () => {
    const response = await fetch("/api/stats");
    const data = await response.json();
    setStats(data);
  };

  const fetchContacts = async () => {
    const response = await fetch("/api/contacts");
    const data = await response.json();
    setContacts(data);
  };

  const fetchActivities = async () => {
    const response = await fetch("/api/activities");
    const data = await response.json();
    setActivities(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchContacts(), fetchActivities()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-500">Your latest transactions</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Money
        </Button>
      </div>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <QuickAction icon={Send} label="Send" />
          <QuickAction icon={Wallet} label="Request" />
          <QuickAction icon={CreditCard} label="Cards" />
        </div>
      </div>

      {/* Recent Contacts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Contacts</CardTitle>
            <Button variant="ghost" className="text-sm gap-2">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-4">
            <SearchBar onSearch={(query) => console.log(query)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {contacts.map((contact, i) => (
              <ContactAvatar
                key={i}
                name={contact.name}
                amount={contact.amount}
                image={contact.image}
                onClick={() => console.log(`Selected ${contact.name}`)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {activities.map((activity, i) => (
            <ActivityItem
              key={i}
              name={activity.name}
              amount={activity.amount}
              type={activity.type}
              time={activity.time}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentApp;