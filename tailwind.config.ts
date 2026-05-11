import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        medway: {
          primary: "#01CFAB",    // Teal - ações/highlights
          secondary: "#1862BC",  // Deep Blue
          dark: "#00205B",       // Dark Navy - títulos
          white: "#FFFFFF",
          light: "#F5F7FA",      // Light gray bg
          gray: "#6B7684",       // Medium gray
          text: "#2C3E50",       // Dark gray text
          success: "#28A745",
          error: "#DC3545",
          warning: "#FFC107",
          info: "#0C5CE6",
        },
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        h1: ["72px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["48px", { lineHeight: "1.3", fontWeight: "700" }],
        h3: ["32px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      spacing: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
      },
      boxShadow: {
        medway: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "medway-lg": "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
