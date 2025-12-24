"use client";

import React, { useEffect, useState } from "react";
import Plans from "../components/Plans";
import { toast, Toaster } from "react-hot-toast";

const Page = () => {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
  });

  const [token, setToken] = useState("");

  // Get token on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken || "");
    }
  }, []);

  // Fetch plans and calculate stats
  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok || res.status === 200) {
          const totalPlans = data.length;
          // Count active plans if your plan model has "active" field
          const activePlans = data.filter((plan) => plan.active !== false).length;

          setStats({ totalPlans, activePlans });
        } else {
          toast.error(data.message || "Failed to fetch plans");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    };

    fetchStats();
  }, [token]);

  const cards = [
    {
      title: "Total Plans",
      value: stats.totalPlans,
      color: "bg-blue-500",
    },
    {
      title: "Active Plans",
      value: stats.activePlans,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Plans
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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

      <Plans />
    </div>
  );
};

export default Page;
