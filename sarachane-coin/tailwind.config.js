/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B91C1C",
          dark: "#911616",
          light: "#DC2626"
        },
        secondary: {
          DEFAULT: "#1D4ED8",
          dark: "#1E3A8A",
          light: "#3B82F6"
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)']
      }
    },
  },
  plugins: [],
} 