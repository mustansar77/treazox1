"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function PlanDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Use search params for plan details
  const planId = searchParams.get("id") || "1";
  const price = Number(searchParams.get("price")) || 1000;
  const duration = searchParams.get("duration") || 30;
  const dailyIncome = searchParams.get("dailyIncome") || 50;

  const [loading, setLoading] = useState(false);
  const [exchange, setExchange] = useState("binance");
  const [trxId, setTrxId] = useState("");

  const EXCHANGE_DETAILS = {
    binance: {
      name: "Binance",
      address: "bnb1qexampleaddresshere",
      network: "BEP-20",
    },
    okx: {
      name: "OKX",
      address: "0xokxexampleaddress",
      network: "ERC-20",
    },
    bitget: {
      name: "Bitget",
      address: "0xbitgetexampleaddress",
      network: "TRC-20",
    },
  };

  const isFormValid = trxId.trim() && planId && price;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please complete all fields");
      return;
    }

    // Simulate successful investment
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Investment submitted successfully!");
      router.push("/dashboard");
    }, 1000);
  };

  const currentExchange = EXCHANGE_DETAILS[exchange];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <Toaster position="top-right" />

      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-6 space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white">
          Plan Details
        </h1>

        {/* PLAN INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-semibold text-green-600">${price}</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-semibold text-green-600">{duration} Days</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500">Daily Earning</p>
            <p className="font-semibold text-green-600">${dailyIncome}</p>
          </div>
        </div>

        {/* EXCHANGE SELECT */}
        <div>
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Deposit Exchange
          </label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-900 text-primary dark:text-white focus:outline-none"
          >
            <option value="binance">Binance</option>
            <option value="okx">OKX</option>
            <option value="bitget">Bitget</option>
          </select>
        </div>

        {/* EXCHANGE DETAILS */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm space-y-2">
          <p>
            <span className="font-semibold">Network:</span>{" "}
            <span className="text-green-500">{currentExchange.network}</span>
          </p>
          <p className="break-all">
            <span className="font-semibold">Address:</span>{" "}
            <span className="text-green-500 font-mono">{currentExchange.address}</span>
          </p>
        </div>

        {/* TRX ID */}
        <div>
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Transaction ID
          </label>
          <input
            type="text"
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder="Enter transaction hash"
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-900 text-primary dark:text-white focus:outline-none"
          />
        </div>

        {/* SUBMIT */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-lg text-white transition
              ${
                !isFormValid || loading
                  ? "bg-primary cursor-not-allowed"
                  : "bg-primary hover:bg-primary/80"
              }`}
          >
            {loading ? "Submitting..." : "Confirm Investment"}
          </button>
        </form>
      </div>
    </div>
  );
}
