"use client";
import React from "react";

const ContactUs = () => {
  return (
    <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title & Description */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-white">
            Contact Us
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Have questions or need support? Our team is here to help you.
            Reach out to us anytime and we’ll get back to you as soon as possible.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Contact Info */}
          <div className="space-y-6 text-center lg:text-left">
            <h3 className="text-xl font-semibold text-primary dark:text-white">
              Get in Touch
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Whether you need help with your account, plans, withdrawals, or
              general inquiries, Treazox support is available 24/7.
            </p>

            <div className="space-y-3 text-sm sm:text-base text-gray-600">
              <p>
                <span className="font-medium">Email:</span> support@treazox.com
              </p>
              <p>
                <span className="font-medium">Support:</span> 24/7 Online
              </p>
              <p>
                <span className="font-medium">Platform:</span> Worldwide
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-base-100 p-6 sm:p-8 rounded-2xl shadow-md">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary dark:text-white">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-primary dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-primary dark:text-white ">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Write your message"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary dark:bg-gray-100 text-white dark:text-primary dark:hover:bg-primary/10 dark:hover:text-white font-semibold hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;
