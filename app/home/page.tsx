"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ScanFace } from "lucide-react";
import StatsGrid from "@/components/ui/StatsGrid";
import QuickActions from "@/components/ui/QuickActions";
import RecentContacts from "@/components/ui/RecentContacts";
import RecentActivity from "@/components/ui/RecentActivity";
import SendMoney from "@/components/ui/send-money";
import RequestMoney from "@/components/ui/request-money";
import BuyCard from "@/components/ui/buy-card";
import Scanner from "@/components/ui/scanner";

const PaymentApp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showRequestMoney, setShowRequestMoney] = useState(false);
  const [showBuyCard, setShowBuyCard] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleFaceScan = () => {
    setShowScanner(true); // Open the Scanner component
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities");
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
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
      {/* Face Scanner Overlay */}
      {showScanner && <Scanner onClose={() => setShowScanner(false)} />}

      {/* Face Scanner Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleFaceScan}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          aria-label="Face Scanner"
        >
          <ScanFace className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* SendMoney Overlay */}
      {showSendMoney && <SendMoney onClose={() => setShowSendMoney(false)} />}

      {/* RequestMoney Overlay */}
      {showRequestMoney && <RequestMoney onClose={() => setShowRequestMoney(false)} />}

      {/* BuyCard Overlay */}
      {showBuyCard && <BuyCard onClose={() => setShowBuyCard(false)} />}

      {/* Main Content */}
      {!showSendMoney && !showRequestMoney && !showBuyCard && !showScanner && (
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
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <RecentActivity activities={activities} />
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentApp;
