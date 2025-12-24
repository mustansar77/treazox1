/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
        primary: "#0F172A",     // Main brand color
        secondary: "#475569", 
        cardBackground:"#94A3B8",
        cardPrice:"#10B981",
        buttonColor:"#B57E64",  // Dark headings
        accent: "#22c55e",      // Highlights / success
        muted: "#64748b",       // Descriptions
        background: "#F8FAFC", // Page background
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
