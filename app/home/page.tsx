"use client";

import React, { useState, useEffect } from "react";
import { Loader2, ScanFace } from "lucide-react";

// Components
import StatsGrid from "@/components/ui/StatsGrid";
import QuickActions from "@/components/ui/QuickActions";
import RecentContacts from "@/components/ui/RecentContacts";
import RecentActivity from "@/components/ui/RecentActivity";
import SendMoney from "@/components/ui/send-money";
import RequestMoney from "@/components/ui/request-money";
import BuyCard from "@/components/ui/buy-card";
import Scanner from "@/components/ui/scanner";

// Styles
import "@/styles/home.css";

// Types
interface PixelStarProps {
  x: number;
  y: number;
  size: number;
}

/**
 * Enhanced CRT Screen Effect Component
 * Creates a more sophisticated CRT screen simulation
 */
const EnhancedCRTEffect: React.FC = () => {
  const [scanLine, setScanLine] = useState(0);
  const [noise, setNoise] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    // Animate scan line
    const animateScanLine = () => {
      const screenHeight = window.innerHeight;
      let currentPosition = 0;

      const moveLine = () => {
        currentPosition += 3;
        if (currentPosition > screenHeight) {
          currentPosition = 0;
        }
        setScanLine(currentPosition);
        requestAnimationFrame(moveLine);
      };

      moveLine();
    };

    // Generate noise artifacts
    const generateNoise = () => {
      const noiseCount = 50;
      const newNoise = Array.from({ length: noiseCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setNoise(newNoise);
    };

    animateScanLine();
    generateNoise();
  }, []);

  return (
    <>
      {/* Scan Line */}
      <div 
        className="crt-scan-line" 
        style={{
          position: 'fixed',
          top: `${scanLine}px`,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0.5
        }}
      />

      {/* CRT Noise Overlay */}
      <div 
        className="crt-noise-overlay" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
          background: noise.map(n => 
            `radial-gradient(circle at ${n.x}% ${n.y}%, rgba(255,255,255,0.05), transparent 50%)`
          ).join(', '),
          opacity: 0.1
        }}
      />

      {/* CRT Curvature and Vignette */}
      <div 
        className="crt-overlay" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9997,
          background: `
            radial-gradient(
              ellipse at center, 
              rgba(0,0,0,0) 0%, 
              rgba(0,0,0,0.3) 100%
            )`,
          boxShadow: 'inset 0 0 200px rgba(0,0,0,0.5)',
          borderRadius: '10px'
        }}
      />
    </>
  );
}; 
/**
 * Pixel Star Background Component
 * Creates a dynamic starry background with randomly positioned pixels
 */
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

/**
 * CRT Screen Line Effect Component
 * Adds dynamic CRT screen line animation
 */
const CRTScreenLines: React.FC = () => {
  const [linePosition, setLinePosition] = useState(0);

  useEffect(() => {
    const animateLine = () => {
      const screenHeight = window.innerHeight;
      let currentPosition = 0;

      const moveLine = () => {
        currentPosition += 5;
        if (currentPosition > screenHeight) {
          currentPosition = 0;
        }
        setLinePosition(currentPosition);
        requestAnimationFrame(moveLine);
      };

      moveLine();
    };

    animateLine();
  }, []);

  return (
    <div 
      className="crt-screen-line" 
      style={{
        position: 'fixed',
        top: `${linePosition}px`,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
        zIndex: 9999,
        pointerEvents: 'none',
        animation: 'scan-line 2s linear infinite'
      }}
    />
  );
};

/**
 * Cyberpunk Loading Screen Component
 * Displays a dynamic loading screen with changing text
 */
const CyberpunkLoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState("INITIALIZING HAWALA NETWORK");

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
        <div className="cyberpunk-loading-title">🌌 HAWALA NETWORK</div>
        <div className="cyberpunk-loading-text">{loadingText}...</div>
        <Loader2 className="cyberpunk-loading-icon animate-spin" />
      </div>
    </div>
  );
};

/**
 * Hawala Payment App Main Component
 * Manages the entire payment application interface and data fetching
 */
const HawalaPaymentApp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Modal state management
  const [activeModal, setActiveModal] = useState<
    'sendMoney' | 'requestMoney' | 'buyCard' | 'scanner' | null
  >(null);

  // Data fetching functions
  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return [];
    }
  };

  // Consolidated data fetching
  useEffect(() => {
    const loadAppData = async () => {
      setLoading(true);
      const [statsData, contactsData, activitiesData] = await Promise.all([
        fetchData("/api/stats"),
        fetchData("/api/contacts"),
        fetchData("/api/activities")
      ]);

      setStats(statsData);
      setContacts(contactsData);
      setActivities(activitiesData);
      
      // Simulate loading delay
      setTimeout(() => setLoading(false), 2000);
    };

    loadAppData();
  }, []);

  // Render loading screen
  if (loading) {
    return <CyberpunkLoadingScreen />;
  }

  // Modal rendering logic
  const renderActiveModal = () => {
    switch (activeModal) {
      case 'sendMoney':
        return <SendMoney onClose={() => setActiveModal(null)} />;
      case 'requestMoney':
        return <RequestMoney onClose={() => setActiveModal(null)} />;
      case 'buyCard':
        return <BuyCard onClose={() => setActiveModal(null)} />;
      case 'scanner':
        return <Scanner onClose={() => setActiveModal(null)} />;
      default:
        return null;
    }
  };

  return (
    <div 
      id="hawala-payment-app" 
      className="cyberpunk-app-container"
    >
      <PixelStarBackground />
      <div 
        id="crt-overlay" 
        className="cyberpunk-crt-overlay"
      />
      <CRTScreenLines />

      {renderActiveModal()}

      <div className="cyberpunk-face-scan-container">
        <button
          onClick={() => setActiveModal('scanner')}
          id="face-scan-btn"
          className="cyberpunk-face-scan-btn"
          aria-label="Face Scanner"
        >
          <ScanFace className="cyberpunk-face-scan-icon" />
        </button>
      </div>

      {!activeModal && (
        <div className="cyberpunk-main-content">
          <div className="cyberpunk-header-section">
            <h1 
              id="cyberpunk-header" 
              className="cyberpunk-main-title"
            >
              HAWALA NETWORK
            </h1>
            <p className="cyberpunk-header-subtitle">
              QUANTUM FINANCIAL TRANSFER
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
              onSendClick={() => setActiveModal('sendMoney')}
              onRequestClick={() => setActiveModal('requestMoney')}
              onBuyCardClick={() => setActiveModal('buyCard')}
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

export default HawalaPaymentApp;