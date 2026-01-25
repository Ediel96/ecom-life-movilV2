/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ed',
          100: '#b3e6c8',
          200: '#80d5a3',
          300: '#4dc47e',
          400: '#1ab359',
          500: '#00942A',
          600: '#007a23',
          700: '#00611c',
          800: '#004715',
          900: '#002e0e',
        },
      },
    },
  },
  plugins: [],
};
