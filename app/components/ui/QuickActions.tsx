import React from "react";
import { Send, Wallet, CreditCard, Coins, Image } from "lucide-react";
import "@/styles/quick-actions.css";

const QuickAction = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
}) => (
  <button
    className="cyberpunk-quick-action"
    onClick={onClick}
  >
    <div className="cyberpunk-quick-action-icon-wrapper">
      <Icon className="cyberpunk-quick-action-icon" />
    </div>
    <span className="cyberpunk-quick-action-label">{label}</span>
  </button>
);

const QuickActions = ({
  onSendClick,
  onRequestClick,
  onBuyCardClick,
}: {
  onSendClick: () => void;
  onRequestClick: () => void;
  onBuyCardClick: () => void;
}) => {
  const handleNFTClick = () => {
    window.location.href = "/nft";
  };

  const handleBuyCryptoClick = () => {
    window.location.href = "/buy-crypto";
  };

  return (
    <div className="cyberpunk-quick-actions-container">
      <h2 className="cyberpunk-quick-actions-title">QUANTUM ACTIONS</h2>
      <div className="cyberpunk-quick-actions-grid">
        <QuickAction icon={Send} label="SEND" onClick={onSendClick} />
        <QuickAction icon={Wallet} label="REQUEST" onClick={onRequestClick} />
        <QuickAction icon={CreditCard} label="CARDS" onClick={onBuyCardClick} />
        <QuickAction icon={Image} label="NFT" onClick={handleNFTClick} />
        <QuickAction icon={Coins} label="CRYPTO" onClick={handleBuyCryptoClick} />
      </div>
    </div>
  );
};

export default QuickActions;