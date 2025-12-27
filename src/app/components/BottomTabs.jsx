"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Plans", href: "/plans" },
  { name: "Team", href: "/team" },
  // { name: "Policy", href: "/policy" },
  { name: "LuckyDraw", href: "luckydraw" },

  { name: "Profile", href: "/profile" },
  
];

const BottomTabs = () => {
  const pathname = usePathname();

  // Hide tabs if path is "/"
  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-2 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 text-center py-3 text-sm font-medium ${
                active
                  ? "text-blue-600 border-t-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabs;
