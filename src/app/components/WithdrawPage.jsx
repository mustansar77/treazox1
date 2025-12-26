"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie"; // <-- import js-cookie

const WithdrawPage = () => {
  const WITHDRAW_OPTIONS = [10, 20, 30, 40, 50];
  const EXCHANGES = [
    { name: "Binance", networks: ["BEP20", "BEP2", "ERC20"] },
    { name: "OKX", networks: ["ERC20", "TRC20"] },
    { name: "Bitget", networks: ["ERC20", "TRC20", "BEP20"] },
  ];

  const [availableBalance, setAvailableBalance] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedExchange, setSelectedExchange] = useState({ name: "", networks: [] });
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const balance = localStorage.getItem("availableBalance") || 1000;
    setAvailableBalance(Number(balance));
  }, []);

  const handleWithdraw = async () => {
    const finalAmount = selectedAmount || customAmount;
    if (!finalAmount || !selectedExchange.name || !selectedNetwork || !address) {
      toast.error("Please fill all fields");
      return;
    }
    if (Number(finalAmount) > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      // Get token from cookies
      const token = Cookies.get("token"); // <-- from cookie
      if (!token) {
        toast.error("Unauthorized: Please login first");
        return;
      }

      const res = await fetch("/api/withdraws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- send in header
        },
        body: JSON.stringify({
          amount: finalAmount,
          exchange: selectedExchange.name,
          network: selectedNetwork,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success(data.message);

      setAvailableBalance((prev) => prev - Number(finalAmount));
      setSelectedAmount("");
      setCustomAmount("");
      setSelectedExchange({ name: "", networks: [] });
      setSelectedNetwork("");
      setAddress("");
    } catch (err) {
      console.error("Withdraw error:", err);
      toast.error(err.message || "Withdraw failed");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <Toaster position="top-right" />

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Withdraw Funds
      </h1>

      {/* Current Assets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500">Available Balance</p>
        <h2 className="text-3xl font-bold text-green-600">${availableBalance}</h2>
      </div>

      {/* Withdraw Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500 mb-2">Select Withdraw Amount</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {WITHDRAW_OPTIONS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount("");
              }}
              className={`px-4 py-2 rounded-lg border ${
                selectedAmount === amt
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="Or enter custom amount"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount("");
          }}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Exchange Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500 mb-2">Select Exchange</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {EXCHANGES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => {
                setSelectedExchange(ex);
                setSelectedNetwork("");
              }}
              className={`px-4 py-2 rounded-lg border ${
                selectedExchange.name === ex.name
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>

        {/* Network Selection */}
        {selectedExchange.name && (
          <div className="mb-4">
            <p className="text-gray-500 mb-2">Select Network</p>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Network</option>
              {selectedExchange.networks.map((net) => (
                <option key={net} value={net}>
                  {net}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Address Input */}
        {selectedNetwork && (
          <div>
            <p className="text-gray-500 mb-2">Withdraw Address</p>
            <input
              type="text"
              placeholder="Paste your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Confirm Withdraw */}
      <div className="mb-8">
        <button
          onClick={handleWithdraw}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Confirm Withdraw
        </button>
      </div>
    </div>
  );
};

export default WithdrawPage;
