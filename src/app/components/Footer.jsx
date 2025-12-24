"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-primary dark:text-white">Treazox</h2>
            <p className="text-gray-600 text-sm">
              Treazox is a modern earning platform offering multiple verified
              income opportunities in one secure and easy-to-use system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className=" cursor-pointer">Home</li>
              <li className=" cursor-pointer">About</li>
              <li className=" cursor-pointer">Plans</li>
              <li className=" cursor-pointer">Lucky Draw</li>
              <li className=" cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-secondary cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-secondary cursor-pointer">Privacy Policy</li>
              <li className="hover:text-secondary cursor-pointer">Risk Disclaimer</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@treazox.com</li>
              <li>Support: 24/7 Online</li>
              <li>Worldwide Access</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} <span className="font-medium">Treazox</span>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
