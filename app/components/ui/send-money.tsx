import React, { useState, useEffect } from "react";
import { Send, User, Search, ArrowRight, ChevronLeft, X, Wallet } from "lucide-react";
import { sendTokens } from "@/utils/send-rupa";
import { ethers } from "ethers";

const SUCCESS_SOUND_BASE64 = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Dam90gYR9gX6CgHp6gIN6eH2Df4CBiIiBfH+Dg4CBhIeGgoGDhoaEhIaKioaGhoyNiYaHjI2KiYqNjoyLjY+PjY2OkZGOjpCSkpCQkpOTkZGTlJOSkpSVlJOTlZaVlJSWl5aVlZaYl5aWl5mYl5eYmZmYmJmampmZmpubmpqbnJybm5ydnZ2dnp+enp6foKCfoKGhoKChoqKhoaKjo6KipKSjo6SlpaSkpaampaamqKenpqeop6eoqainp6mqqqmpqqysq6utrq2srK6urq2tr6+ur7CwsLCxsbGwsLKysrGys7OysrO0tLOztLW1tLS1tra1tba3t7a2t7i4t7e4ubm4uLm6urm5uru7urq7vLy7u7y9vby8vb69vb2+v7+/v8DAwMDBwcHAwMLCwcHCw8PDw8PExMTDxMXFxMTFxsbFxcbHx8bGx8jIx8fIycnIyMnKysnJysvLysrLzMzLy8zNzczMzc7Ozc3Oz87Oz9DQz8/Q0dHQ0NHR0dDQ0dLS0dHS09PS0tPU1NPT1NXV1NTV1tbV1dbX19bW19jY19fY2dnY2Nna2tnZ2tvb2trb3Nzb29zd3dzc3d7e3d3e39/e3t/g4N/f4OHh4ODh4uLh4eLj4+Li4+Tk4+Pk5eXk5OXm5uXl5ufn5ubn6Ojn5+jp6ejo6erq6enq6+vq6uvs7Ovr7O3t7Ozt7u7t7e7v7+7u7/Dw7+/w8fHw8PHy8vHx8vPz8vLz9PTz8/T19fT09fb29fX2+PgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";


interface Contact {
  id: number;
  name: string;
  image: string;
  lastAmount: string;
  address: string;
}

interface SendMoneyProps {
  onClose: () => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  // Same contacts array as before...
  const contacts: Contact[] = [
    { 
      id: 1, 
      name: "Prakash Magesh", 
      image: "/api/placeholder/40/40", 
      lastAmount: "2,500", 
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    { 
      id: 2, 
      name: "Irfan Shaikh", 
      image: "/api/placeholder/40/40", 
      lastAmount: "1,800", 
      address: "0x123d35Cc6634C0532925a3b844Bc454e4438f123"
    },
    { 
      id: 3, 
      name: "Soham Patil", 
      image: "/api/placeholder/40/40", 
      lastAmount: "3,200", 
      address: "0x456d35Cc6634C0532925a3b844Bc454e4438f456"
    },
  ];

  // Same wallet connection functions as before...
  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature!");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
    setIsConnecting(false);
  };

  const playSuccessSound = () => {
    const audio = new Audio("/sounds/success.mp3");
    audio.volume = 0.5;
    audio.play().catch(console.error);
  };

  const handleSend = async () => {
    if (!selectedContact || !amount) return;
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!ethers.isAddress(selectedContact.address)) {
      alert("Invalid recipient address!");
      return;
    }

    setLoading(true);

    try {
      const transactionHash = await sendTokens(selectedContact.address, amount);
      setLoading(false);
      
      // Play success sound and show animations
      playSuccessSound();
      setShowSuccess(true);
      setShowConfetti(true);

      // Reset and close after animation
      setTimeout(() => {
        setShowConfetti(false);
        setShowSuccess(false);
        onClose();
      }, 3000);

      console.log(`Transaction successful with hash: ${transactionHash}`);
    } catch (error) {
      setLoading(false);
      console.error("Error sending tokens:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  // Same component implementations as before...
  const ConnectWalletButton = () => (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="w-full gap-2 inline-flex items-center justify-center px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
    >
      {isConnecting ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      {walletAddress ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );

  const ContactSelect = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search name or paste address..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>
      <div className="space-y-2">
        {contacts
          .filter(contact => 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.address.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setStep(2);
              }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  {contact.image ? (
                    <img src={contact.image} alt={contact.name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-500">Last: Rs {contact.lastAmount}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
      </div>
    </div>
  );

  const AmountInput = () => {
    if (!selectedContact) return null;

    return (
      <div className="space-y-6">
        {!walletAddress && (
          <div className="mb-6">
            <ConnectWalletButton />
          </div>
        )}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
            {selectedContact.image ? (
              <img src={selectedContact.image} alt={selectedContact.name} className="w-full h-full rounded-full" />
            ) : (
              <User className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <h3 className="font-medium">{selectedContact.name}</h3>
          <p className="text-xs text-gray-500 break-all">{selectedContact.address}</p>
        </div>
        <div className="space-y-4">
          <div className="relative mt-2">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium">Rs</div>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 text-2xl font-bold text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium"
              >
                Rs {quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
            rows={3}
          />
        </div>
        <button
          className="w-full gap-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={!amount || loading || !walletAddress}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {walletAddress ? "Send Money" : "Connect Wallet to Send"}
        </button>
      </div>
    );
  };

  const SuccessMessage = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4 relative max-w-sm w-full mx-4">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 animate-confetti-l">
              <div className="w-3 h-3 bg-yellow-400 rotate-45" />
            </div>
            <div className="absolute top-0 left-1/2 animate-confetti-m">
              <div className="w-3 h-3 bg-green-400 rotate-45" />
            </div>
            <div className="absolute top-0 right-1/4 animate-confetti-r">
              <div className="w-3 h-3 bg-blue-400 rotate-45" />
            </div>
          </div>
        )}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <div className="w-12 h-12 relative">
            <svg 
              className="w-full h-full text-green-500 animate-check-mark"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
        <p className="text-gray-600">
          You sent Rs {parseInt(amount).toLocaleString()} to {selectedContact?.name}
        </p>
        <div className="text-sm text-gray-500">Transaction completed successfully</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {step === 2 && (
              <button
                className="h-8 w-8 p-2 rounded-full hover:bg-gray-50"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-xl font-medium">{step === 1 ? "Send Money" : "Amount"}</h2>
          </div>
          <button
            className="h-8 w-8 p-2 rounded-full hover:bg-gray-50"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {step === 1 ? <ContactSelect /> : <AmountInput />}
      </div>
      {showSuccess && <SuccessMessage />}
    </div>
  );
};

export default SendMoney;