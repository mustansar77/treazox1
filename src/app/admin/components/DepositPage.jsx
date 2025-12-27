"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";

const DepositPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending | approved | rejected

  const fetchDeposits = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized: Please login first");

      const res = await fetch("/api/deposit", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch deposits");

      setDeposits(data.deposits);
    } catch (err) {
      console.error("Fetch deposits error:", err);
      toast.error(err.message || "Failed to fetch deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const res = await fetch("/api/deposit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setDeposits((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
      );
      toast.success(`Deposit marked as ${newStatus}`);
    } catch (err) {
      console.error("Update deposit status error:", err);
      toast.error(err.message || "Failed to update deposit status");
    }
  };

  const filteredDeposits = deposits.filter((d) => d.status === activeTab);

  return (
    <div className=" sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-sm sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Admin Deposit Management
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table for desktop */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
  <table className="min-w-[max-content] w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">#</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">User Email</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Exchange(Network)</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Amount</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Exchange Address</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Trx ID</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Status</th>
        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Action</th>
      </tr>
    </thead>

    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {loading ? (
        <tr>
          <td colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-300">
            Loading deposits...
          </td>
        </tr>
      ) : filteredDeposits.length === 0 ? (
        <tr>
          <td colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-300">
            No deposits in this tab
          </td>
        </tr>
      ) : (
        filteredDeposits.map((item, index) => (
          <tr key={item._id}>
            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{index + 1}</td>
            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item.user?.email}</td>
            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">
              {item.exchange?.name} - {item.exchange?.network}
            </td>
            <td className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-100">${item.amount}</td>
            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200 font-mono">{item.exchange?.address}</td>
            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200 max-w-[200px] truncate">{item.trxId}</td>
            <td className="px-4 py-2 text-sm">
              <span className={`px-3 py-1 rounded-[5px] text-xs font-medium ${
                item.status === "approved" ? "bg-green-800 text-white" :
                item.status === "rejected" ? "bg-red-600 text-white" :
                "bg-yellow-400 text-black"
              }`}>
                {item.status}
              </span>
            </td>
            <td className="px-4 py-2 text-center">
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item._id, e.target.value)}
                className="px-3 py-1 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default DepositPage;
