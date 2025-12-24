"use client";
import React, { useState } from "react";

const plansData = [
  {
    title: "Plan 1",
    price: "$50",
    dailyEarning: "$3 / day",
    duration: "30 Days",
  },
  {
    title: "Plan 2",
    price: "$100",
    dailyEarning: "$7 / day",
    duration: "30 Days",
  },
  {
    title: "Plan 3",
    price: "$200",
    dailyEarning: "$15 / day",
    duration: "45 Days",
  },
  {
    title: "Plan 4",
    price: "$300",
    dailyEarning: "$25 / day",
    duration: "60 Days",
  },
  {
    title: "Plan 5",
    price: "$500",
    dailyEarning: "$45 / day",
    duration: "60 Days",
  },
  {
    title: "Plan 6",
    price: "$800",
    dailyEarning: "$75 / day",
    duration: "90 Days",
  },
  {
    title: "Plan 7",
    price: "$1000",
    dailyEarning: "$100 / day",
    duration: "90 Days",
  },
  {
    title: "Plan 8",
    price: "$1500",
    dailyEarning: "$160 / day",
    duration: "120 Days",
  },
];

const InvestmentPlans = () => {
  const [visiblePlans, setVisiblePlans] = useState(4);

  const handleViewMore = () => {
    setVisiblePlans(plansData.length);
  };

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-white">
            Investment Plans
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose an investment plan that fits your goals and start earning
            daily through our secure and transparent system.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plansData.slice(0, visiblePlans).map((plan, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">
                {plan.title}
              </h3>

              <div className="space-y-2 text-gray-600 text-sm">
                <p className="text-green-500">
                  <span className="font-medium text-primary dark:text-white">Price:</span> {plan.price}
                </p>
                <p className="text-green-500">
                  <span className="font-medium text-primary dark:text-white">Daily Earning:</span>{" "}
                  {plan.dailyEarning}
                </p>
                <p className="text-green-500">
                  <span className="font-medium text-primary dark:text-white">Duration:</span>{" "}
                  {plan.duration}
                </p>
              </div>

              <button className="mt-6 w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/70 font-semibold hover:opacity-90 transition">
                Invest Now
              </button>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {visiblePlans < plansData.length && (
          <div className="mt-12 text-center">
            <button
              onClick={handleViewMore}
              className="px-8 py-3 rounded-lg border border-primary text-primary dark:border-white dark:text-white font-semibold dark:hover:bg-white dark:hover:text-primary hover:bg-primary  hover:text-white transition"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestmentPlans;
