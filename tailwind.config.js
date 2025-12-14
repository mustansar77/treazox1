/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* 🌈 Global Colors */
      colors: {
        primary: "#2563eb",     // Main brand color
        secondary: "#0f172a",   // Dark headings
        accent: "#22c55e",      // Highlights / success
        muted: "#64748b",       // Descriptions
        background: "#f8fafc", // Page background
      },

      /* 🔤 Global Fonts */
      fontFamily: {
        heading: ["newFamily", "Poppins", "sans-serif"],   // Titles / Headings
        subheading: ["Inter", "sans-serif"],                // Sub headings
        body: ["Roboto", "sans-serif"],                     // Descriptions / content
        accent: ["Montserrat", "sans-serif"],               // Optional accent text
      },
    },
  },
  plugins: [],
};
