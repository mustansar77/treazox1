"use client";
import React from "react";

const aboutCards = [
  {
    title: "Multiple Earning Systems",
    description:
      "Treazox offers diversified earning options including daily earnings, investments, referrals, bonuses, salaries, and lucky draws.",
  },
  {
    title: "Secure & Transparent",
    description:
      "We prioritize user trust with a transparent earning structure and secure system for managing funds and activities.",
  },
  {
    title: "User-Friendly Platform",
    description:
      "Our dashboard is designed to be simple, fast, and easy to use, even for beginners.",
  },
  {
    title: "Community Growth",
    description:
      "Treazox grows with its users by rewarding referrals and encouraging team-based success.",
  },
];

const AboutUs = () => {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-primary dark:text-white md:text-4xl font-bold mb-4">
            About Treazox
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Treazox is a modern earning platform built to empower users with
            multiple income opportunities under one secure and reliable system.
            We focus on simplicity, transparency, and long-term growth.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-md bg-base-200 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-primary dark:text-white">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
