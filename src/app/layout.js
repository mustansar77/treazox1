"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNav from "./components/AdminNav";
import BottomTabs from "./components/BottomTabs";

/* ---------------- ADMIN LAYOUT ---------------- */
const AdminLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <AdminNav />
    <div className="w-full flex-grow">{children}</div>
  </div>
);

/* ---------------- USER LAYOUT ---------------- */
const UserLayout = ({ children }) => {
  const pathname = usePathname();

  // paths where footer & bottom tabs should NOT appear
  const hideFooterPaths = ["/login", "/signup"];
  const hideFooter = hideFooterPaths.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Navbar */}
      <div className="block md:block">
        <Navbar />
      </div>

      {/* Page Content */}
      <div className={`flex-grow ${!hideFooter ? "pb-11 md:pb-0" : ""}`}>
        {children}
      </div>

      {/* Footer (desktop only) */}
      {!hideFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}

      {/* Bottom Tabs (mobile only) */}
      {!hideFooter && <BottomTabs />}
    </div>
  );
};

/* ---------------- ROOT LAYOUT ---------------- */
export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-background">
        {isAdminRoute ? (
          <AdminLayout>{children}</AdminLayout>
        ) : (
          <UserLayout>{children}</UserLayout>
        )}
      </body>
    </html>
  );
}
