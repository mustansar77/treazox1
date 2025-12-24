"use client";
import React from "react";

const LandingPage = () => {
  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Treazox – Smarter Ways to Earn
        </h1>

        <p className="text-secondary text-lg mb-8">
          Treazox is a modern earning platform offering multiple verified income
          opportunities, including investment plans, daily earnings, referrals,
          bonuses, salaries, and lucky draws—all in one secure and easy-to-use
          system.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition">
            Get Started
          </button>

          <button className="px-6 py-3 rounded-lg border bg-buttonColor border-transparent text-white font-semibold hover:bg-white hover:text-black transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
