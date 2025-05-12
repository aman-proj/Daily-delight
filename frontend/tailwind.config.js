/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lilac: {
          50: '#f5f0ff',
          100: '#e8d8ff',
          200: '#d1b2ff',
          300: '#b68dff',
          400: '#a46bff',
          500: '#9b5bff',
          600: '#8a4bff',
          700: '#7a3cff',
          800: '#6a2dff',
          900: '#5a1eff',
        },
      },
    },
  },
  plugins: [],
}

