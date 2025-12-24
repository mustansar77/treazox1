"use client";

import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const Withdraw = () => {
  const [withdraws, setWithdraws] = useState([
    { id: 1, email: "user1@gmail.com", address: "0xA1B2C3D4", amount: 150, status: "processing" },
    { id: 2, email: "user2@gmail.com", address: "0xF9E8D7C6", amount: 300, status: "completed" },
    { id: 3, email: "user3@gmail.com", address: "bc1qxyz123", amount: 500, status: "processing" },
  ]);

  const [searchEmail, setSearchEmail] = useState("");

  const handleStatusChange = (id, newStatus) => {
    setWithdraws((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
    );
    toast.success(`Withdraw marked as ${newStatus}`);
  };

  // Filter withdraws by email
  const filteredWithdraws = withdraws.filter((w) =>
    w.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Withdraw Requests
      </h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">User Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Withdraw Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredWithdraws.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                  No withdraw requests found
                </td>
              </tr>
            ) : (
              filteredWithdraws.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-200">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-200">{item.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-200 break-all">{item.address}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-100">${item.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-2 rounded-[5px] text-xs font-medium ${
                      item.status === "completed" ? "bg-green-800 text-white" : "bg-yellow-400 text-black"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none"
                    >
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
