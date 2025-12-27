"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.jpg";

const adminNavItems = [
  { name: "Plans", href: "/admin/plans" },
  { name: "Users", href: "/admin/users" },
  { name: "Investments", href: "/admin/investments" },
  { name: "Draw", href: "/admin/luckydraw" },
  { name: "Withdraw", href: "/admin/withdraw" },
  { name: "Deposit", href: "/admin/deposit" },


];

const AdminNav = () => {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 🌙 Persist theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-lg px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2">
          <Image src={logo} alt="logo" width={40} height={40} />
          <span className="text-xl font-bold text-black dark:text-white">
            Treazox Admin
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-200 font-medium">
          {adminNavItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="hover:text-primary dark:hover:text-buttonColor transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-gray-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 bg-white dark:bg-gray-900 rounded-lg shadow p-4 space-y-4">

          {adminNavItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-700 dark:text-gray-200"
            >
              {item.name}
            </Link>
          ))}

          <hr className="border-gray-200 dark:border-gray-700" />

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            Toggle Theme
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNav;
