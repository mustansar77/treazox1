"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const ITEMS_PER_PAGE = 15;

const Investments = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]); // hardcoded approved
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);

  // Token
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  // Fetch pending only
  const fetchPending = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/investments/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) setPending(data);
      else toast.error(data.message || "Failed to load");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPending();
  }, [token]);

  // Approve / Reject
  const handleStatusUpdate = async (inv, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/investments/${inv._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        if (status === "active") {
          setApproved((prev) => [...prev, inv]); // move to approved
        }
        setPending((prev) => prev.filter((i) => i._id !== inv._id));
        toast.success(`Investment ${status}`);
      }
    } catch {
      toast.error("Action failed");
    }
  };

  // Active data
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
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Investments
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
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

      {/* SAME TABLE STYLING */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="dark:text-white">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Daily Earning
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Deposit Exchange
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
               Trx Id
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center dark:text-white py-4">
                  No data
                </td>
              </tr>
            ) : (
              paginated.map((inv) => (
                <tr key={inv._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {inv.user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {inv.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {inv.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {inv.plan.dailyEarning}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Binance
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    324352163612
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    {activeTab === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(inv, "active")
                          }
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(inv, "rejected")
                          }
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
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300"
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
