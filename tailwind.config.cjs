/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        panel: "#0b1226",
        glow: "#38bdf8",
        violet: "#8b5cf6",
      },
      boxShadow: {
        panel: "0 24px 80px rgba(5, 8, 22, 0.55)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
