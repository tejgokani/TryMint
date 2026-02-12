/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#00ff88',
        },
        dark: {
          bg: '#0a0f1a',
          card: '#111827',
          border: '#1f2937',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
