/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Wordmark-only font; body text stays on the default Inter/system stack
        display: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        page: '#0A0E1A',
        surface: '#131B2E',
        text: '#F5F7FA',
        muted: '#8B95AC',
        accent: '#FF7A33',
        secondary: '#5DCAA5',
      },
      boxShadow: {
        flat: '0 0 0 1px rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};
