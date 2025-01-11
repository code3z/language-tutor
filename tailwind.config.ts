import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Platypi", "ui-serif", "Georgia"],
        sans: ["Helvitica Neue", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      },
      colors: {
        background: "#f4f3f1",
        primary: "#F68C5A",
        "secondary-text": "#6D6C6A",
        "primary-text": "#1F1F1F",
        "tertiary-text": "#A2A19F",
      },
    },
  },
  plugins: [],
} satisfies Config;
