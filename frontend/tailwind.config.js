/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { start: '#4f46e5', end: '#7c3aed' },
        dark: { start: '#1e293b', end: '#8b5cf6' },
      },
    },
  },
  plugins: [],
};
