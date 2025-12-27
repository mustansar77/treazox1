"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Bell, Moon, Sun, Menu, X, Settings, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import logo from "../../../public/logo.jpg";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Plans", href: "/plans" },
  { name: "Team", href: "/team" },
  { name: "Policy", href: "/policy" },
  { name: "Profile", href: "/profile" },
];

const notificationsData = [
  { id: 1, text: "🎉 Investment approved" },
  { id: 2, text: "💰 Referral bonus added" },
  { id: 3, text: "📢 New plan launched" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(null);

  // ✅ Get token from cookies
  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    setToken(tokenFromCookie || null);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // ✅ Logout (remove cookie)
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  const iconColor = darkMode ? "white" : "black";

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-xl px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="logo" width={40} height={40} />
          <span className="text-2xl font-bold text-black dark:text-white">
            Treazox
          </span>
        </Link>

        {/* Desktop Menu */}
        {!isAuthPage && token && (
          <ul className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-200 font-medium">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}
          </ul>
        )}

        {/* Right Section */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowNotifications(!showNotifications)
                    }
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Bell size={20} color={iconColor} />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
                      <h4 className="font-semibold mb-3">Notifications</h4>
                      {notificationsData.map((n) => (
                        <p
                          key={n.id}
                          className="text-sm border-b pb-2"
                        >
                          {n.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Settings size={20} color={iconColor} />
                  </button>

                  {showSettings && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
