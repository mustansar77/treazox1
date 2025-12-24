"use client";

import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  // Dummy state, replace with API fetch later
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    activeUsers: 0,
    luckyDraws: 0,
  });

  useEffect(() => {
    // Fetch real data here and update state
    setStats({
      totalUsers: 1250,
      totalInvestments: 452000,
      activeUsers: 980,
      luckyDraws: 320,
    });
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "bg-blue-500",
    },
    {
      title: "Total Investments",
      value: `$${stats.totalInvestments.toLocaleString()}`,
      color: "bg-green-500",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      color: "bg-yellow-500",
    },
    {
      title: "Lucky Draw Participation",
      value: stats.luckyDraws,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
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
    </div>
  );
};

export default AdminDashboard;
