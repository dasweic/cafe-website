import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          primary: "#3E2723",    // Dark Coffee Brown
          secondary: "#D7CCC8",  // Warm Beige
          background: "#FDFBF7", // Cream / Off White
          accent: "#CC7A6B",     // Terracotta / Muted Gold-ish
          text: "#2C2C2C",       // Dark Charcoal
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      }
    },
  },
  plugins: [],
};
export default config;