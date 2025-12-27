"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";

const WITHDRAW_OPTIONS = [10, 20, 30, 40, 50];
const EXCHANGES = [
  { name: "Binance", networks: ["BEP20", "BEP2", "ERC20"] },
  { name: "OKX", networks: ["ERC20", "TRC20"] },
  { name: "Bitget", networks: ["ERC20", "TRC20", "BEP20"] },
];

const WithdrawPage = () => {
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

  // 🔥 Withdraw calculations
  const withdrawAmount = Number(selectedAmount || customAmount || 0);
  const fee = Number(((withdrawAmount * 10) / 100).toFixed(2));
  const netAmount = Number((withdrawAmount - fee).toFixed(2));

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Please enter a valid withdraw amount");
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!selectedExchange.name || !selectedNetwork || !address) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Unauthorized: Please login first");
        return;
      }

      const res = await fetch("/api/withdraws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          exchange: selectedExchange.name,
          network: selectedNetwork,
          address,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Withdraw failed");

      toast.success("Withdraw request submitted");

      setAvailableBalance((prev) => prev - withdrawAmount);
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

      {/* Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500">Available Balance</p>
        <h2 className="text-3xl font-bold text-green-600">${availableBalance}</h2>
      </div>

      {/* Amount */}
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
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Fee Info */}
      {withdrawAmount > 0 && (
        <div className="bg-yellow-100 dark:bg-gray-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Withdraw Fee (10%): <span className="font-semibold">${fee}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            You will receive:{" "}
            <span className="font-bold text-green-600">${netAmount}</span>
          </p>
        </div>
      )}

      {/* Exchange */}
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

        {selectedExchange.name && (
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white mb-4"
          >
            <option value="">Select Network</option>
            {selectedExchange.networks.map((net) => (
              <option key={net} value={net}>
                {net}
              </option>
            ))}
          </select>
        )}

        {selectedNetwork && (
          <input
            type="text"
            placeholder="Withdraw address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        )}
      </div>

      <button
        onClick={handleWithdraw}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Confirm Withdraw
      </button>
    </div>
  );
};

export default WithdrawPage;
