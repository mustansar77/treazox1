"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";


export default function SignUpPage() {
  const router = useRouter();
  const NEXT_API_URL = "/api/users/signup"; // Local backend

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(""); // New referral input
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }

  setLoading(true);
  try {
   const res = await fetch("/api/users/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fullName, email, phone, password, referralCode }),
});

const data = await res.json();

if (res.ok) {
  toast.success("Signup successful!");
  router.push("/login");
} else {
  toast.error(data.message || "Signup failed!");
}
  } catch (err) {
    console.error("Signup error:", err);
    toast.error("Something went wrong! Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster position="top-right" />
      <div className="max-w-md w-full bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          <input
            type="text"
            placeholder="Referral Code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={acceptPolicy}
              onChange={(e) => setAcceptPolicy(e.target.checked)}
              className="w-4 h-4 accent-primary"
              required
            />
            <label className="text-primary dark:text-white">
              I accept the <Link href="/policy">Terms & Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/70 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-primary dark:text-white">
          Already have an account?{" "}
          <Link href="/login" className="font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
