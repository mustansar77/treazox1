"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false); // ensures client-only
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  useEffect(() => {
    setMounted(true); // page is now mounted
    const ref = searchParams?.get("ref");
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  if (!mounted) return null; // prevent prerendering errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, referralCode, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful!");
        router.push("/login");
      } else {
        toast.error(data.message || "Signup failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster position="top-right" />
      <div className="max-w-lg w-full bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Referral Code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={!!searchParams?.get("ref")}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div>
            <input
              type="checkbox"
              checked={acceptPolicy}
              onChange={(e) => setAcceptPolicy(e.target.checked)}
              required
            />
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
