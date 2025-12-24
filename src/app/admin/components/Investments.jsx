"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const Investments = () => {
  const [pending, setPending] = useState([
    {
      _id: "1",
      user: { fullName: "John Doe", email: "john@example.com" },
      amount: 500,
      plan: { dailyEarning: 50 },
      exchange: "Binance",
      trxId: "TRX123456",
    },
    {
      _id: "2",
      user: { fullName: "Jane Smith", email: "jane@example.com" },
      amount: 300,
      plan: { dailyEarning: 30 },
      exchange: "Binance",
      trxId: "TRX654321",
    },
  ]);

  const [approved, setApproved] = useState([
    {
      _id: "3",
      user: { fullName: "Alice Johnson", email: "alice@example.com" },
      amount: 700,
      plan: { dailyEarning: 70 },
      exchange: "Binance",
      trxId: "TRX987654",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);

  // Approve / Reject actions
  const handleStatusUpdate = (inv, status) => {
    if (status === "active") {
      setApproved((prev) => [...prev, inv]);
    }
    setPending((prev) => prev.filter((i) => i._id !== inv._id));
    toast.success(`Investment ${status}`);
  };

  const data = activeTab === "pending" ? pending : approved;

  const filtered = data.filter((inv) =>
    inv.user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className=" sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Investments
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <button
          onClick={() => {
            setActiveTab("pending");
            setPage(1);
          }}
          className={`px-4 py-2 rounded ${
            activeTab === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => {
            setActiveTab("approved");
            setPage(1);
          }}
          className={`px-4 py-2 rounded ${
            activeTab === "approved"
              ? "bg-green-600 text-white"
              : "bg-gray-300"
          }`}
        >
          Approved
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by email..."
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="mb-4 w-full sm:w-1/3 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="dark:text-white">
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                User
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                Daily Earning
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                Deposit Exchange
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                Trx Id
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center dark:text-white py-4">
                  No data
                </td>
              </tr>
            ) : (
              paginated.map((inv) => (
                <tr key={inv._id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {inv.user.fullName}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {inv.user.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${inv.amount}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${inv.plan.dailyEarning}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {inv.exchange}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {inv.trxId}
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    {activeTab === "pending" ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(inv, "active")}
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(inv, "rejected")}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Investments;
