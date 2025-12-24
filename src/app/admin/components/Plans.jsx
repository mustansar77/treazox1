"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const Plans = () => {
  const [plans, setPlans] = useState([
    { _id: "1", totalPrice: 500, duration: 10, dailyEarning: 50 },
    { _id: "2", totalPrice: 300, duration: 5, dailyEarning: 30 },
    { _id: "3", totalPrice: 700, duration: 14, dailyEarning: 70 },
  ]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    totalPrice: "",
    duration: "",
    dailyEarning: "",
  });

  // Open modal for create or edit
  const openModal = (plan = null) => {
    setCurrentPlan(plan);
    if (plan) {
      setFormData({
        totalPrice: plan.totalPrice,
        duration: plan.duration,
        dailyEarning: plan.dailyEarning,
      });
    } else {
      setFormData({ totalPrice: "", duration: "", dailyEarning: "" });
    }
    setModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPlan) {
      // Update plan
      setPlans((prev) =>
        prev.map((p) =>
          p._id === currentPlan._id ? { ...p, ...formData } : p
        )
      );
      toast.success("Plan updated");
    } else {
      // Create new plan
      const newPlan = { _id: Date.now().toString(), ...formData };
      setPlans((prev) => [...prev, newPlan]);
      toast.success("Plan created");
    }
    setModalOpen(false);
  };

  // Delete plan
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    setPlans(plans.filter((p) => p._id !== id));
    toast.success("Plan deleted");
  };

  // Filter plans by totalPrice or duration
  const filteredPlans = plans.filter(
    (p) =>
      p.totalPrice.toString().includes(search) ||
      p.duration.toString().includes(search)
  );

  return (
    <div className=" sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Plans
        </h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2 sm:mt-0"
        >
          Create New Plan
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by total price or duration..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                Daily Earning
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-300">
                  No plans found
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan) => (
                <tr key={plan._id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                    ${plan.totalPrice}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                    {plan.duration} days
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                    ${plan.dailyEarning}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-center flex justify-center gap-2">
                    <button
                      onClick={() => openModal(plan)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {currentPlan ? "Edit Plan" : "Create Plan"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  Total Price
                </label>
                <input
                  type="number"
                  value={formData.totalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, totalPrice: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-200">
                  Daily Earning
                </label>
                <input
                  type="number"
                  value={formData.dailyEarning}
                  onChange={(e) =>
                    setFormData({ ...formData, dailyEarning: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {currentPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
