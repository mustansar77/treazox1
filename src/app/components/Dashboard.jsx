"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Copy, FileText, Wallet, Gift } from "lucide-react";

const Dashboard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  const [dashboard, setDashboard] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [commissionBalance, setCommissionBalance] = useState(0);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //   toast.error("Please login first");
    //   router.push("/login");
    //   return;
    // }

    // Dummy data (replace with API later)
    setDashboard({
      totalAssets: 12450,
      availableBalance: 9800,
      dailyIncome: 45,
    });

    const storedReferralCode = localStorage.getItem("refferalCode");
    setReferralCode(storedReferralCode || "N/A");
    setCommissionBalance(2650);

    if (storedReferralCode) {
      setReferralLink(
        `${window.location.origin}/signup?ref=${storedReferralCode}`
      );
    }

    setLoading(false);
  }, [router]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      <div className="max-w-[1170px] mx-auto p-4 sm:p-6">
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Assets
        </h1>

        {/* ASSETS CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <p className="text-gray-500">Total Assets</p>
          <h2 className="text-3xl font-bold text-green-600 mb-6">
            ${dashboard.totalAssets}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="font-semibold text-green-500">
                ${dashboard.availableBalance}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Commission Balance</p>
              <p className="font-semibold text-green-500">${commissionBalance}</p>
            </div>
          </div>

          <div className="flex w-full flex-row gap-3">
            <button className="px-6 w-full py-3 bg-green-600 text-white rounded-lg">
              Deposit
            </button>
            <button className="px-6 py-3 w-full bg-blue-600 text-white rounded-lg">
              Withdraw
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { id: "account", label: "Account History", icon: FileText },
            { id: "withdraw", label: "Withdraw History", icon: Wallet },
            { id: "lucky", label: "Lucky Draw", icon: Gift },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`p-4 rounded-lg shadow flex flex-col items-center gap-1 transition
                ${
                  activeTab === id
                    ? "border-[1px] text-green-500 border-green-300 bg-white dark:bg-gray-800"
                    : "bg-white dark:bg-gray-800 text-primary dark:text-white border border-transparent"
                }`}
            >
              <Icon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {activeTab === "account" && (
            <HistoryTable
              title="Account History"
              data={[
                { type: "Deposit", amount: 500, status: "Success" },
                { type: "Withdraw", amount: 200, status: "Pending" },
                { type: "Withdraw", amount: 150, status: "Failed" },
                { type: "Deposit", amount: 500, status: "Success" },
                { type: "Withdraw", amount: 200, status: "Pending" },
                { type: "Withdraw", amount: 150, status: "Failed" },
                { type: "Deposit", amount: 500, status: "Success" },
                { type: "Withdraw", amount: 200, status: "Pending" },
                { type: "Withdraw", amount: 150, status: "Failed" },
              ]}
            />
          )}

          {activeTab === "withdraw" && (
            <HistoryTable
              title="Withdraw History"
              data={[
                { type: "Withdraw", amount: 300, status: "Success" },
                { type: "Withdraw", amount: 100, status: "Pending" },
                { type: "Withdraw", amount: 250, status: "Rejected" },
                  { type: "Withdraw", amount: 300, status: "Success" },
                { type: "Withdraw", amount: 100, status: "Pending" },
                { type: "Withdraw", amount: 250, status: "Rejected" },
                  { type: "Withdraw", amount: 300, status: "Success" },
                { type: "Withdraw", amount: 100, status: "Pending" },
                { type: "Withdraw", amount: 250, status: "Rejected" },
                  { type: "Withdraw", amount: 300, status: "Success" },
                { type: "Withdraw", amount: 100, status: "Pending" },
                { type: "Withdraw", amount: 250, status: "Rejected" },
                  { type: "Withdraw", amount: 300, status: "Success" },
                { type: "Withdraw", amount: 100, status: "Pending" },
                { type: "Withdraw", amount: 250, status: "Rejected" },
              ]}
            />
          )}

          {activeTab === "lucky" && (
            <HistoryTable
              title="Lucky Draw"
              data={[
                { type: "Lucky Draw Win", amount: 50, status: "Success" },
                { type: "Lucky Draw", amount: 0, status: "Failed" },
                 { type: "Lucky Draw Win", amount: 50, status: "Success" },
                { type: "Lucky Draw", amount: 0, status: "Failed" },
                 { type: "Lucky Draw Win", amount: 50, status: "Success" },
                { type: "Lucky Draw", amount: 0, status: "Failed" },
                 { type: "Lucky Draw Win", amount: 50, status: "Success" },
                { type: "Lucky Draw", amount: 0, status: "Failed" },
                 { type: "Lucky Draw Win", amount: 50, status: "Success" },
                { type: "Lucky Draw", amount: 0, status: "Failed" },
              ]}
            />
          )}
        </div>

        {/* REFERRAL */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
          <p className="text-sm text-gray-500 mb-1">Referral Code</p>
          <p className="font-mono font-semibold mb-4 text-green-500">{referralCode}</p>

          <p className="text-sm text-gray-500 mb-1">Referral Link</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 p-3 rounded-lg text-green-500 bg-gray-100 dark:bg-gray-900 text-sm"
            />
            <button
              onClick={copyReferralLink}
              className="p-3 bg-blue-600 text-white rounded-lg"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= TABLE ================= */

const HistoryTable = ({ title, data }) => (
  <div className="p-4 sm:p-6">
    <h2 className="text-lg font-semibold mb-4 text-primary dark:text-white">{title}</h2>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="text-left py-2">Type</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="text-primary dark:text-white">
              <td className="py-3">{item.type}</td>
              <td>${item.amount}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      item.status === "Success"
                        ? " text-green-700"
                        : item.status === "Pending"
                        ? " text-yellow-700"
                        : " text-red-700"
                    }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Dashboard;
