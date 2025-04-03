/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7738DF",
          dark: "#6330bd",
          light: "#9969ff",
        },
        dark: {
          DEFAULT: "#121212",
          surface: "#1E1E1E",
          lighter: "#2a2a2a",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
        "pulse-purple": "pulse 2s infinite",
      },
      boxShadow: {
        "purple-glow": "0 0 15px rgba(119, 56, 223, 0.5)",
      },
    },
  },
  plugins: [],
};
