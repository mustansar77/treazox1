"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const DEPOSIT_OPTIONS = [10, 20, 30, 40, 50];
const EXCHANGES = [
  { name: "Binance", address: "bnb1xyzabc123", network: "BEP20" },
  { name: "OKX", address: "okx1xyzabc123", network: "ERC20" },
  { name: "Bitget", address: "bitget1xyzabc123", network: "TRC20" },
];

const DepositPage = () => {
  const [assets, setAssets] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedExchange, setSelectedExchange] = useState(EXCHANGES[0]);
  const [trxId, setTrxId] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const userToken = Cookies.get("token");
    if (userToken) setToken(userToken);
    setAssets(12450);
  }, []);

  const handleDeposit = async () => {
    if (!selectedAmount && !customAmount) return toast.error("Please select or enter deposit amount");
    if (!trxId) return toast.error("Please enter trx ID");

    const amount = selectedAmount || Number(customAmount);

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          exchange: JSON.stringify(selectedExchange),
          trxId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Deposit failed");

      toast.success("Deposit submitted successfully!");
      setSelectedAmount(null);
      setCustomAmount("");
      setTrxId("");
    } catch (err) {
      console.error("Deposit error:", err);
      toast.error(err.message || "Deposit failed");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Deposit Funds</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <p className="text-gray-500">Current Assets</p>
        <h2 className="text-3xl font-bold text-green-600">${assets}</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500 mb-2">Select Deposit Amount</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {DEPOSIT_OPTIONS.map((amt) => (
            <button
              key={amt}
              onClick={() => setSelectedAmount(amt)}
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
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500 mb-2">Select Exchange / Chain</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {EXCHANGES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => setSelectedExchange(ex)}
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

        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-500 mb-1">Address</p>
          <p className="font-mono text-gray-700 dark:text-green-500">{selectedExchange.address}</p>
          <p className="text-sm text-gray-500 mt-2">Network</p>
          <p className="font-semibold text-gray-700 dark:text-green-500">{selectedExchange.network}</p>
        </div>

        <input
          type="text"
          placeholder="Enter trx ID"
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-8">
        <button
          onClick={handleDeposit}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Confirm Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositPage;
