"use client";
import React from "react";

const LuckyDraw = () => {
  return (
    <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title & Description */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-white">
            Lucky Draw
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Participate in Treazox Lucky Draw and get a chance to win exciting
            cash prizes, bonuses, and exclusive rewards. Every user has an
            equal opportunity to win.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="space-y-3 text-sm sm:text-base text-gray-600 mb-6">
              <p>
                <span className="font-medium">Entry Fee:</span> $5 per draw
              </p>
              <p>
                <span className="font-medium">Draw Frequency:</span> Weekly
              </p>
              <p>
                <span className="font-medium">Rewards:</span> Cash prizes &
                bonuses
              </p>
            </div>

            <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition">
              Participate in Lucky Draw
            </button>
          </div>

          {/* Right Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-base-200 shadow-md">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center lg:text-left text-primary dark:text-white">
              Why Join the Lucky Draw?
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm sm:text-base">
              <li>• Easy participation</li>
              <li>• Fair and transparent system</li>
              <li>• Multiple winners every draw</li>
              <li>• Instant rewards & bonuses</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LuckyDraw;
