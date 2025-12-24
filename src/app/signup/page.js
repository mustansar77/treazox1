"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false); // <--- new
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const searchParams = useSearchParams();

  // Only run on client
  useEffect(() => {
    setMounted(true);

    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  if (!mounted) return null; // <--- prevents prerender

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
          {/* Your input fields */}
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
          <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Referral Code" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
          <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" type="password" required />
          <div>
            <input type="checkbox" checked={acceptPolicy} onChange={(e) => setAcceptPolicy(e.target.checked)} required />
            <label>I accept the Terms and Policy</label>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
