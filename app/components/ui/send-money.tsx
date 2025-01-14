import React, { useState, useEffect } from "react";
import { Send, User, Search, ArrowRight, ChevronLeft, X } from "lucide-react";

const SendMoney = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  const contacts = [
    { id: 1, name: "Prakash Magesh", image: "/api/placeholder/40/40", lastAmount: "2,500" },
    { id: 2, name: "Irfan Shaikh", image: "/api/placeholder/40/40", lastAmount: "1,800" },
    { id: 3, name: "Soham Patil", image: "/api/placeholder/40/40", lastAmount: "3,200" },
  ];

  const playSuccessSound = () => {
    const audio = new Audio("/hawala/sounds/payment-success.mp3");
    audio.play().catch(console.error);
  };

  const handleSend = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    playSuccessSound();
    setShowSuccess(true);
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
      onClose();
    }, 5000);
  };

  const ContactSelect = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search name or paste address..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>
      <div className="space-y-2">
        {contacts.map((contact) => (
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

  const AmountInput = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
          {selectedContact.image ? (
            <img src={selectedContact.image} alt={selectedContact.name} className="w-full h-full rounded-full" />
          ) : (
            <User className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <h3 className="font-medium">{selectedContact.name}</h3>
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
        disabled={!amount || loading}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Send Money
      </button>
    </div>
  );

  const SuccessMessage = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">Payment Successful!</h3>
        <p className="text-gray-600">
          You sent Rs {parseInt(amount).toLocaleString()} to {selectedContact?.name}
        </p>
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
      <div className="p-4">{step === 1 ? <ContactSelect /> : <AmountInput />}</div>
      {showSuccess && <SuccessMessage />}
    </div>
  );
};

export default SendMoney;