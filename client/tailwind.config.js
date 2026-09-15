/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0B0F14',
          card: '#111820',
          surface: '#161D27',
          border: 'rgba(255,255,255,0.07)',
        },
        green: {
          DEFAULT: '#0B8A3E',
          light: '#22C55E',
          glow: 'rgba(11,138,62,0.25)',
        },
        orange: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          glow: 'rgba(249,115,22,0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
