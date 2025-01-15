"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import StatsGrid from "@/components/ui/StatsGrid";
import QuickActions from "@/components/ui/QuickActions";
import RecentContacts from "@/components/ui/RecentContacts";
import RecentActivity from "@/components/ui/RecentActivity";
import SendMoney from "@/components/ui/send-money";
import RequestMoney from "@/components/ui/request-money";
import BuyCard from "@/components/ui/buy-card";

const PaymentApp = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showRequestMoney, setShowRequestMoney] = useState(false);
  const [showBuyCard, setShowBuyCard] = useState(false);

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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* SendMoney overlay */}
      {showSendMoney && (
        <SendMoney onClose={() => setShowSendMoney(false)} />
      )}

      {/* RequestMoney overlay */}
      {showRequestMoney && (
        <RequestMoney onClose={() => setShowRequestMoney(false)} />
      )}

      {/* BuyCard overlay */}
      {showBuyCard && (
        <BuyCard onClose={() => setShowBuyCard(false)} />
      )}

      {/* Main Content */}
      {!showSendMoney && !showRequestMoney && !showBuyCard && (
        <div className="p-4 space-y-6 max-w-screen-lg mx-auto">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500 text-sm">Your latest transactions</p>
          </div>

          {/* Stats Grid */}
          <StatsGrid stats={stats} />

          {/* Quick Actions */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <QuickActions
              onSendClick={() => setShowSendMoney(true)}
              onRequestClick={() => setShowRequestMoney(true)}
              onBuyCardClick={() => setShowBuyCard(true)}
            />
          </div>

          {/* Recent Contacts */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Contacts</h2>
            <RecentContacts contacts={contacts} />
          </div>

          {/* Recent Activity */}
          {/* Recent Activity */}
<div className="bg-white shadow-md rounded-lg p-4">
  <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
  <RecentActivity />
</div>

        </div>
      )}
    </>
  );
};

export default PaymentApp;
