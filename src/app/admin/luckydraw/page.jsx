"use client";

import React, { useEffect, useState } from "react";
import LuckDraw from "../components/LuckDraw";

const Page = () => {
  const [luckyDrawStats, setLuckyDrawStats] = useState({
    totalDraws: 0,
    activeDraws: 0,
    participants: 0,
    completedDraws: 0,
  });

  useEffect(() => {
    // Fetch lucky draw stats from API or backend
    setLuckyDrawStats({
      totalDraws: 25,
      activeDraws: 8,
      participants: 350,
      completedDraws: 17,
    });
  }, []);

  const cards = [
    { title: "Total Lucky Draws", value: luckyDrawStats.totalDraws, color: "bg-purple-500" },
    { title: "Active Lucky Draws", value: luckyDrawStats.activeDraws, color: "bg-blue-500" },
    { title: "Participants", value: luckyDrawStats.participants, color: "bg-green-500" },
    { title: "Completed Draws", value: luckyDrawStats.completedDraws, color: "bg-gray-500" },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Lucky Draw
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
      <LuckDraw/>
    </div>
  );
};

export default Page;
