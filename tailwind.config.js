/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trading-dark': '#0d1421',
        'trading-darker': '#131722',
        'trading-border': '#2a2e39',
        'trading-text': '#e1e5e9',
        'trading-text-dim': '#868b94',
        'trading-text-bright': '#f7f8fa',
        'trading-blue': '#2962ff',
        'trading-green': '#26a69a',
        'trading-red': '#ef5350',
      },
      fontFamily: {
        'trading': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}