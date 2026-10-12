/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fbf9f4',
          100: '#f5f0e6',
          200: '#ece1cf',
          300: '#dec9ab',
          400: '#cbab84',
          500: '#bc9064',
          600: '#ae7b54',
          700: '#916346',
          800: '#76513c',
          900: '#604333',
        },
        slate: {
          850: '#172033',
          925: '#0b1120',
          950: '#060a12',
        },
        crimson: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          900: '#450a0a',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        serif: ['"Merriweather"', '"Lora"', '"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      }
    },
  },
  plugins: [],
}
