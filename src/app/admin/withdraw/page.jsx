"use client";

import React, { useEffect, useState } from "react";
import Withdraw from "../components/Withdraw";

const Page = () => {
  const [withdrawStats, setWithdrawStats] = useState({
    totalBalance: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    // Hardcoded stats for now, can be replaced with API
    setWithdrawStats({
      totalBalance: 12450,
      pending: 2100,
      approved: 6500,
      rejected: 850,
    });
  }, []);

  const cards = [
    { title: "Total Balance", value: `$${withdrawStats.totalBalance}`, color: "bg-blue-500" },
    { title: "Pending Withdraw", value: `$${withdrawStats.pending}`, color: "bg-yellow-500" },
    { title: "Approved Withdraw", value: `$${withdrawStats.approved}`, color: "bg-green-500" },
    { title: "Rejected Withdraw", value: `$${withdrawStats.rejected}`, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Withdraw Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-lg text-white ${card.color} flex flex-col justify-between`}
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="mt-4 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Withdraw Table */}
      <Withdraw />
    </div>
  );
};

export default Page;
