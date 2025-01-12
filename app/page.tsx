"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Proper type declaration for ethereum
declare global {
  interface Window {
    ethereum: any; // Use `any` to resolve type conflict
  }
}

const Login: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if MetaMask is available
  const checkMetaMaskAvailability = (): boolean => {
    if (!window?.ethereum?.isMetaMask) {
      setError("MetaMask is not installed. Please install it from metamask.io");
      return false;
    }
    return true;
  };

  // Connect MetaMask Wallet
  const connectWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      if (!checkMetaMaskAvailability()) {
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts[0]) {
        setWalletAddress(accounts[0]);
        // Navigate to home (implement your navigation logic here)
        window.location.href = "/home";
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMetaMaskAvailability();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold text-center tracking-tight">
            Hawala
          </CardTitle>
          <p className="text-center text-gray-500 font-light">
            The future of seamless crypto transactions
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {error && (
            <Alert className="text-sm">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!walletAddress ? (
            <Button
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-light"
              onClick={connectWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          ) : (
            <div className="p-4 rounded-lg bg-gray-50 space-y-2">
              <p className="text-sm text-gray-500 font-light">Connected Wallet</p>
              <p className="font-mono text-sm break-all">{walletAddress}</p>
              <p className="text-sm text-gray-500 animate-pulse font-light">
                Redirecting...
              </p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-light tracking-wider">
                Secure Connection
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-400 font-light">
            By connecting, you agree to our Terms and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
