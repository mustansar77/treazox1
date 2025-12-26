"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    totalPrice: "",
    duration: "",
    dailyEarning: "",
  });

  const token = Cookies.get("token");

  // ======================
  // FETCH PLANS
  // ======================
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setPlans(data.plans || []);
      } else {
        toast.error(data.message || "Failed to fetch plans");
      }
    } catch (err) {
      toast.error("Error fetching plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ======================
  // OPEN MODAL
  // ======================
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

  // ======================
  // CREATE / UPDATE
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return toast.error("Admin not authenticated");

    try {
      const method = currentPlan ? "PUT" : "POST";
      const body = currentPlan
        ? JSON.stringify({ id: currentPlan._id, ...formData })
        : JSON.stringify(formData);

      const res = await fetch("/api/admin/plans", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(currentPlan ? "Plan updated" : "Plan created");
        fetchPlans();
        setModalOpen(false);
        setCurrentPlan(null);
      } else {
        toast.error(data.message || "Failed to save plan");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // ======================
  // DELETE PLAN (ADMIN)
  // ======================
  const handleDelete = async (id) => {
    if (!token) return toast.error("Admin not authenticated");
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const res = await fetch("/api/admin/plans", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Plan deleted");
        fetchPlans();
      } else {
        toast.error(data.message || "Failed to delete plan");
      }
    } catch (err) {
      toast.error("Error deleting plan");
    }
  };

  // ======================
  // FILTER
  // ======================
  const filteredPlans = plans.filter(
    (p) =>
      p.totalPrice.toString().includes(search) ||
      p.duration.toString().includes(search)
  );

  return (
    <div className="sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
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
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-500 dark:text-gray-300"
                >
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
              <input
                type="number"
                placeholder="Total Price"
                value={formData.totalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, totalPrice: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Daily Earning"
                value={formData.dailyEarning}
                onChange={(e) =>
                  setFormData({ ...formData, dailyEarning: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
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
