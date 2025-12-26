"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

export default function PlanDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Plan details from search params
  const planId = searchParams.get("id") || "1";
  const price = Number(searchParams.get("price")) || 1000;
  const duration = searchParams.get("duration") || 30;
  const dailyIncome = searchParams.get("dailyIncome") || 50;
const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [exchange, setExchange] = useState("binance");
  const [trxId, setTrxId] = useState("");
  
  // Pass userId (for demo, using cookie or localStorage; replace with actual logged-in userId)
  const userId = Cookies.get("userId") || "1234567890abcdef"; 

  const EXCHANGE_DETAILS = {
    binance: { name: "Binance", address: "bnb1qexampleaddresshere", network: "BEP-20" },
    okx: { name: "OKX", address: "0xokxexampleaddress", network: "ERC-20" },
    bitget: { name: "Bitget", address: "0xbitgetexampleaddress", network: "TRC-20" },
  };

  const isFormValid = trxId.trim() && planId && price && exchange && userId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please complete all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json",
    Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId, transactionId: trxId, exchange}),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Investment submitted successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Failed to submit investment");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentExchange = EXCHANGE_DETAILS[exchange];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <Toaster position="top-right" />
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-6 space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white">
          Plan Details
        </h1>

        {/* Plan Info */}
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

        {/* Exchange Select */}
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

        {/* Exchange Details */}
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

        {/* Transaction ID */}
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

        {/* Submit */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-lg text-white transition
              ${!isFormValid || loading ? "bg-primary cursor-not-allowed" : "bg-primary hover:bg-primary/80"}`}
          >
            {loading ? "Submitting..." : "Confirm Investment"}
          </button>
        </form>
      </div>
    </div>
  );
}
