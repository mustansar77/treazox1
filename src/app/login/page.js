"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Detect if production (Vercel)
  const isProd = process.env.NODE_ENV === "production";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        toast.success("Login successful!");
        console.log(data);

        // ✅ Set cookies with proper options for Vercel/production
        Cookies.set("token", data.token, {
          expires: 30,
          secure: isProd,
          sameSite: "strict",
          path: "/",
        });

        Cookies.set("role", data.user.role, {
          expires: 30,
          secure: isProd,
          sameSite: "strict",
          path: "/",
        });

        // Redirect based on role
        if (data.user.role === "admin") router.push("/admin");
        else router.push("/dashboard");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster position="top-right" />
      <div className="max-w-md w-full bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-primary dark:text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-primary dark:text-white">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/70 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-primary dark:text-white">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary dark:text-white font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
