"use client";
import {  useEffect } from "react";


import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";



export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  

  const searchParams = useSearchParams();

useEffect(() => {
  const ref = searchParams.get("ref");
  if (ref) {
    setReferralCode(ref);
  }
}, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, referralCode, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup successful!");
        // Redirect to login page after signup
        router.push("/login");
      } else {
        toast.error(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster position="top-right" />
      <div className="max-w-lg w-full bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-primary dark:text-white">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border-[1px] rounded-[4px] text-primary dark:text-white bg-gray-50 dark:bg-gray-900 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-primary dark:text-white">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-[1px] rounded-[4px] text-primary dark:text-white bg-gray-50 dark:bg-gray-900 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-primary dark:text-white">Phone</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border-[1px] rounded-[4px] text-primary dark:text-white bg-gray-50 dark:bg-gray-900 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

         <div>
  <label className="block mb-1 font-medium text-primary dark:text-white">
    Referral Code (optional)
  </label>
  <input
    type="text"
    placeholder="Enter referral code"
    value={referralCode}
    onChange={(e) => setReferralCode(e.target.value)}
    disabled={!!searchParams.get("ref")}
    className={`w-full px-4 py-3 border-[1px] rounded-[4px] text-primary dark:text-white bg-gray-50 dark:bg-gray-900 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      searchParams.get("ref") ? "bg-gray-100 cursor-not-allowed" : ""
    }`}
  />
</div>

          <div>
            <label className="block mb-1 font-medium text-primary dark:text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-[1px] rounded-[4px] text-primary dark:text-white bg-gray-50 dark:bg-gray-900 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-primary dark:text-white">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-[1px] rounded-[4px] text-primary dark:text-white bg-gray-50 dark:bg-gray-900 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={acceptPolicy}
              onChange={(e) => setAcceptPolicy(e.target.checked)}
              className="mr-2"
              required
            />
            <label className="text-sm text-primary dark:text-white">
              I accept the <span className="text-blue-500">Terms and Policy</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/70 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-primary dark:text-white">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
