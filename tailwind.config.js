/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#FFFDF8',
        surface: '#FFFFFF',
        ink: '#293B36',
        muted: '#5F706A',
        primary: {
          DEFAULT: '#376F64',
          hover: '#2B5A51',
          50: '#F2F8F5',
          100: '#E4F1E9',
          500: '#376F64',
          600: '#2B5A51',
          700: '#20453E',
        },
        mint: '#E4F1E9',
        sky: '#E5F1F7',
        blush: '#F8E3E4',
        sun: '#F8EDCB',
        line: '#DCE6DF',
        novelerror: '#A33D49',
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Lora"', 'Georgia', 'serif'],
        novel: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      }
    },
  },
  plugins: [],
}
