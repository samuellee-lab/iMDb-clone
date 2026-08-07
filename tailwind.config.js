/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        imdb: {
          gold: '#F5C518',
          dark: '#121212',
          card: '#1A1A1A',
          hover: '#2A2A2A',
          muted: '#9CA3AF',
          border: '#333333',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
