"use client";

import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const LuckDraw = () => {
  const [luckyDraws, setLuckyDraws] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    buyPrice: "",
    winningPrice: "",
    participants: "",
    winner: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { buyPrice, winningPrice, participants } = formData;

    if (!buyPrice || !winningPrice || !participants) {
      toast.error("All required fields must be filled");
      return;
    }

    if (editIndex !== null) {
      const updated = [...luckyDraws];
      updated[editIndex] = formData;
      setLuckyDraws(updated);
      toast.success("Lucky Draw updated");
    } else {
      setLuckyDraws([...luckyDraws, formData]);
      toast.success("Lucky Draw created");
    }

    resetForm();
  };

  const handleEdit = (index) => {
    setFormData(luckyDraws[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this lucky draw?")) {
      setLuckyDraws(luckyDraws.filter((_, i) => i !== index));
      toast.success("Lucky Draw deleted");
    }
  };

  const resetForm = () => {
    setFormData({
      buyPrice: "",
      winningPrice: "",
      participants: "",
      winner: "",
    });
    setEditIndex(null);
    setShowModal(false);
  };

  return (
    <div className=" sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Lucky Draws
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Lucky Draw
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <table className="min-w-[700px] w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 ">
            <tr className="dark:text-white">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Buy Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Winning Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Winner
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {luckyDraws.length === 0 ? (
              <tr className="dark:text-white">
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 dark:text-gray-300"
                >
                  No Lucky Draw Found
                </td>
              </tr>
            ) : (
              luckyDraws.map((item, index) => (
                <tr key={index} className="dark:text-white">
                  <td className="px-6 py-4 text-sm">
                    {item.buyPrice}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.winningPrice}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.participants}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.winner || "Not Selected"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-row gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(index)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-3">
          <div className="bg-white dark:bg-gray-800 p-5 rounded w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editIndex !== null ? "Edit Lucky Draw" : "Create Lucky Draw"}
            </h2>

            <div className="space-y-3">
              <input
                type="number"
                name="buyPrice"
                placeholder="Buy Price"
                className="w-full px-3 py-2 border rounded"
                value={formData.buyPrice}
                onChange={handleChange}
              />
              <input
                type="number"
                name="winningPrice"
                placeholder="Winning Price"
                className="w-full px-3 py-2 border rounded"
                value={formData.winningPrice}
                onChange={handleChange}
              />
              <input
                type="number"
                name="participants"
                placeholder="Number of Participants"
                className="w-full px-3 py-2 border rounded"
                value={formData.participants}
                onChange={handleChange}
              />
              <input
                type="text"
                name="winner"
                placeholder="Winner (optional)"
                className="w-full px-3 py-2 border rounded"
                value={formData.winner}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editIndex !== null ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckDraw;
