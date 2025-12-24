"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

export default function Plans() {
  const router = useRouter();

  // Hardcoded sample plans
  const [plans] = useState([
    { _id: "1", totalPrice: 1000, duration: 30, dailyEarning: 50 },
    { _id: "2", totalPrice: 2000, duration: 60, dailyEarning: 120 },
    { _id: "3", totalPrice: 500, duration: 15, dailyEarning: 30 },
    { _id: "4", totalPrice: 3000, duration: 90, dailyEarning: 200 },
    { _id: "5", totalPrice: 1500, duration: 45, dailyEarning: 80 },
  ]);

  const handleInvest = (plan) => {
    router.push(
      `/plans/detail?id=${plan._id}&price=${plan.totalPrice}&duration=${plan.duration}&dailyIncome=${plan.dailyEarning}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-primary mx-auto p-5">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center text-primary dark:text-white mb-8">
        Our Investment Plans
      </h1>
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-bold text-primary dark:text-white text-center mb-4">
                Plan {index + 1}
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="text-green-500 text-lg font-semibold">
                    ${plan.totalPrice}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Duration (Days)</p>
                  <p className="text-green-500 text-lg font-semibold">{plan.duration} Days</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Daily Income</p>
                  <p className="text-green-500 text-lg font-semibold">
                    ${plan.dailyEarning}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleInvest(plan)}
                className="mt-6 w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/50 transition duration-300"
              >
                Invest Now <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
