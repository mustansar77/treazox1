"use client";

import React, { useEffect, useState } from "react";
import Allusers from "../components/Allusers";
import { toast, Toaster } from "react-hot-toast";

const Page = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/user-stats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUserStats({
            totalUsers: data.totalUsers,
            activeUsers: data.totalActive,
            inactiveUsers: data.totalInactive,
            premiumUsers: data.totalPremium,
          });
        } else {
          toast.error(data.message || "Failed to fetch user stats");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const cards = [
    { title: "Total Users", value: userStats.totalUsers, color: "bg-blue-500" },
    { title: "Active Users", value: userStats.activeUsers, color: "bg-green-500" },
    { title: "Inactive Users", value: userStats.inactiveUsers, color: "bg-yellow-500" },
    { title: "Premium Users", value: userStats.premiumUsers, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Users
      </h1>

      {loading ? (
        <p className="text-white text-lg">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
      )}

      <Allusers />
    </div>
  );
};

export default Page;
