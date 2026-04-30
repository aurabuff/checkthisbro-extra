import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148,163,184,0.18), 0 20px 60px rgba(15,23,42,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
