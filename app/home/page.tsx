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
import "@/styles/home.css"

interface PixelStarProps {
  x: number;
  y: number;
  size: number;
}

const PixelStarBackground: React.FC = () => {
  const [stars, setStars] = useState<PixelStarProps[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 200;
      const newStars = Array.from({ length: starCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div 
      id="pixel-star-background" 
      className="cyberpunk-star-background"
    >
      {stars.map((star, index) => (
        <div
          key={index}
          className="cyberpunk-star"
          data-x={star.x}
          data-y={star.y}
          data-size={star.size}
        />
      ))}
    </div>
  );
};

const CyberpunkLoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState("INITIALIZING CYBER WALLET");

  useEffect(() => {
    const loadingTexts = [
      "CONNECTING QUANTUM NETWORK",
      "DECRYPTING FINANCIAL MATRIX",
      "SYNCING TRANSACTION PROTOCOLS",
      "CALIBRATING CYBER CIRCUITS"
    ];

    const interval = setInterval(() => {
      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="cyberpunk-loading-screen" 
      className="cyberpunk-loading-container"
    >
      <div className="cyberpunk-loading-content">
        <div className="cyberpunk-loading-title">🌌 CYBER WALLET</div>
        <div className="cyberpunk-loading-text">{loadingText}...</div>
        <Loader2 className="cyberpunk-loading-icon" />
      </div>
    </div>
  );
};

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
    setShowScanner(true);
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
      
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    fetchData();
  }, []);

  if (loading) {
    return <CyberpunkLoadingScreen />;
  }

  return (
    <div 
      id="cyberpunk-payment-app" 
      className="cyberpunk-app-container"
    >
      <PixelStarBackground />

      <div 
        id="crt-overlay" 
        className="cyberpunk-crt-overlay"
      />

      {showScanner && <Scanner onClose={() => setShowScanner(false)} />}

      <div className="cyberpunk-face-scan-container">
        <button
          onClick={handleFaceScan}
          id="face-scan-btn"
          className="cyberpunk-face-scan-btn"
          aria-label="Face Scanner"
        >
          <ScanFace className="cyberpunk-face-scan-icon" />
        </button>
      </div>

      {showSendMoney && <SendMoney onClose={() => setShowSendMoney(false)} />}
      {showRequestMoney && <RequestMoney onClose={() => setShowRequestMoney(false)} />}
      {showBuyCard && <BuyCard onClose={() => setShowBuyCard(false)} />}

      {!showSendMoney && !showRequestMoney && !showBuyCard && !showScanner && (
        <div className="cyberpunk-main-content">
          <div className="cyberpunk-header-section">
            <h1 
              id="cyberpunk-header" 
              className="cyberpunk-main-title"
            >
              CYBER WALLET
            </h1>
            <p className="cyberpunk-header-subtitle">
              QUANTUM FINANCIAL NETWORK
            </p>
          </div>

          <div 
            id="stats-grid-container" 
            className="cyberpunk-content-panel"
          >
            <StatsGrid stats={stats} />
          </div>

          <div 
            id="quick-actions-container" 
            className="cyberpunk-content-panel"
          >
            <QuickActions
              onSendClick={() => setShowSendMoney(true)}
              onRequestClick={() => setShowRequestMoney(true)}
              onBuyCardClick={() => setShowBuyCard(true)}
            />
          </div>

          <div 
            id="recent-contacts-container" 
            className="cyberpunk-content-panel"
          >
            <h2 className="cyberpunk-section-title">
              RECENT CONTACTS
            </h2>
            <RecentContacts contacts={contacts} />
          </div>

          <div 
            id="recent-activity-container" 
            className="cyberpunk-content-panel"
          >
            <h2 className="cyberpunk-section-title">
              TRANSACTION HISTORY
            </h2>
            <RecentActivity activities={activities} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentApp;