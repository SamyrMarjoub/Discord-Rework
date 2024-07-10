import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'query': { 'raw': '(max-width:1100px)' },
        'queryH': { 'raw': '(max-width:1250px)' },
        'tablets': { 'raw': "(max-width:1050px)" },
        "tablets2": { 'raw': "(max-width:800px)" },
        "smalltablets": { 'raw': "(max-width:750px)" },
        "tdr1":{"raw": "(max-width:700px)"},
        "mobilebig": { 'raw': "(max-width:650px)"},
        "mobile": { 'raw': "(max-width:500px)" },
        "smallmobile": { 'raw': "(max-width:330px)" }
      }
    },
  },
  plugins: [],
};
export default config;
