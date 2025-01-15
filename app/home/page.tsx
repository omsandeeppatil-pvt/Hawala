"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import { UIButton } from "@/components/ui/button";
import StatsGrid from "@/components/ui/StatsGrid";
import QuickActions from "@/components/ui/QuickActions";
import RecentContacts from "@/components/ui/RecentContacts";
import RecentActivity from "@/components/ui/RecentActivity";
import SendMoney from "@/components/ui/send-money";
import RequestMoney from "@/components/ui/request-money";

const PaymentApp = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showRequestMoney, setShowRequestMoney] = useState(false);

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
    <>
      {showSendMoney ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <SendMoney onClose={() => setShowSendMoney(false)} />
          </div>
        </div>
      ) : showRequestMoney ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <RequestMoney onClose={() => setShowRequestMoney(false)} />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-gray-500">Your latest transactions</p>
            </div>
            <UIButton variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Money
            </UIButton>
          </div>

          {/* Stats Grid */}
          <StatsGrid stats={stats} />

          {/* Quick Actions */}
          <QuickActions
            onSendClick={() => setShowSendMoney(true)}
            onRequestClick={() => setShowRequestMoney(true)}
          />

          {/* Recent Contacts */}
          <RecentContacts contacts={contacts} />

          {/* Recent Activity */}
          <RecentActivity activities={activities} />
        </div>
      )}
    </>
  );
};

export default PaymentApp;
