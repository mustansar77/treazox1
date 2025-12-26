"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie"; // to read token from cookies

const Withdraw = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWithdraws = async () => {
    try {
      const token = Cookies.get("token"); // read token from cookies
      if (!token) throw new Error("Unauthorized: Please login first");

      const res = await fetch("/api/withdraws", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch withdraws");

      setWithdraws(data.withdraws);
    } catch (err) {
      console.error("Fetch withdraws error:", err);
      toast.error(err.message || "Failed to fetch withdraws");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const res = await fetch("/api/withdraws", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setWithdraws((prev) =>
        prev.map((w) => (w._id === id ? { ...w, status: newStatus } : w))
      );

      toast.success(`Withdraw marked as ${newStatus}`);
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const filteredWithdraws = withdraws.filter((w) =>
    w.user?.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Withdraw Requests
      </h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">User Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Exchange</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Network Type</th>

              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Withdraw Address</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Status</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                  Loading withdraws...
                </td>
              </tr>
            ) : filteredWithdraws.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                  No withdraw requests found
                </td>
              </tr>
            ) : (
              filteredWithdraws.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item.user?.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200 break-all">{item.exchange}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200 break-all">{item.network}</td>

                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200 break-all">{item.address}</td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-100">${item.amount}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-3 py-1 rounded-[5px] text-xs font-medium ${
                      item.status === "completed" ? "bg-green-800 text-white" :
                      item.status === "processing" ? "bg-yellow-400 text-black" :
                      "bg-gray-400 text-white"
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
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
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

export default Withdraw;
