/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // ✅ This line enables dark mode
  content: [
        "./src/**/*.{js,jsx,ts,tsx}", // ✅ Tell Tailwind to scan your files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

