import React, { useState, useEffect } from "react";
import { Send, User, Search, ArrowRight, ChevronLeft, X, Wallet } from "lucide-react";
import { sendTokens } from "@/utils/send-rupa";
import ethers from "ethers";

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

  const contacts: Contact[] = [
    { id: 1, name: "Prakash Magesh", image: "/api/placeholder/40/40", lastAmount: "2,500", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
    { id: 2, name: "Irfan Shaikh", image: "/api/placeholder/40/40", lastAmount: "1,800", address: "0x123d35Cc6634C0532925a3b844Bc454e4438f123" },
    { id: 3, name: "Soham Patil", image: "/api/placeholder/40/40", lastAmount: "3,200", address: "0x456d35Cc6634C0532925a3b844Bc454e4438f456" },
  ];

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        // Type assertion added for 'accounts' to ensure it's an array of strings
        const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
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
      // Type assertion added for 'accounts' to ensure it's an array of strings
      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
    setIsConnecting(false);
  };

  const playSuccessSound = () => {
    const audio = new Audio("https://github.com/omsandippatil/Hawala/blob/main/sounds/payment-success.mp3");
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
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setAmount(amount.toString())}
                className="px-4 py-2 rounded-lg bg-gray-200 text-sm text-gray-700 hover:bg-gray-300"
              >
                Rs {amount}
              </button>
            ))}
          </div>
        </div>
        <div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>
    );
  };

  const ConfirmPayment = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-lg">
          <p>Amount</p>
          <p>Rs {amount}</p>
        </div>
        {note && (
          <div className="flex items-center justify-between text-lg">
            <p>Note</p>
            <p>{note}</p>
          </div>
        )}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full mt-4 gap-2 inline-flex items-center justify-center px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send Payment
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {step === 1 && <ContactSelect />}
        {step === 2 && <AmountInput />}
        {step === 3 && <ConfirmPayment />}
        {showSuccess && (
          <div className="text-center mt-6 text-green-600 font-semibold">Payment Successful!</div>
        )}
        {showConfetti && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-300">🎉</div>
          </div>
        )}
        <div className="absolute top-0 right-0 p-3 cursor-pointer" onClick={onClose}>
          <X className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
