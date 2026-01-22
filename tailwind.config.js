/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bloom: {
          light: '#fdf2f8', // pink-50
          DEFAULT: '#db2777', // pink-600
          dark: '#831843', // pink-900
          accent: '#8b5cf6', // violet-500
          accentLight: '#ede9fe', // violet-50
          accentDark: '#4c1d95', // violet-900
        },
        deep: {
          bg: '#1e1b4b', // indigo-950
          card: '#312e81', // indigo-900
          text: '#e0e7ff', // indigo-100
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}