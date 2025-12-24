"use client";

import React, { useEffect, useState } from "react";
import Investments from "../components/Investments";

const Page = () => {
  const [investmentStats, setInvestmentStats] = useState({
    totalInvested: 0,
    activePackages: 0,
    pendingApprovals: 0,
    completedInvestments: 0,
  });

  useEffect(() => {
    // Fetch investment data from API
    setInvestmentStats({
      totalInvested: 125000, // example amount
      activePackages: 45,
      pendingApprovals: 8,
      completedInvestments: 30,
    });
  }, []);

  const cards = [
    { title: "Total Invested", value: `$${investmentStats.totalInvested}`, color: "bg-green-500" },
    { title: "Active Packages", value: investmentStats.activePackages, color: "bg-blue-500" },
    { title: "Pending Approvals", value: investmentStats.pendingApprovals, color: "bg-yellow-500" },
    { title: "Completed Investments", value: investmentStats.completedInvestments, color: "bg-gray-500" },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Investments
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Investments/>
    </div>
  );
};

export default Page;
