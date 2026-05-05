/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        navy: {
          DEFAULT: "#0A1628",
          2: "#0F1F3D",
        },
        esg: {
          planet:  "#0EA472",
          people:  "#F59E0B",
          gov:     "#8B5CF6",
          blue:    "#1B4FD8",
          "blue-l": "#3B72F6",
        },
        card: {
          DEFAULT: "#0D1B33",
          2: "#111E36",
        },
        border: "#1E2D4A",
        muted: "#7B91B0",
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease forwards",
        "spin-slow": "spin 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
