/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#321b2d',
        cream: '#fff8f5',
        rose: '#ff6f91',
        'rose-light': '#ffb7c9',
        'rose-deep': '#e04867',
        lav: '#c9b8ff',
        gold: '#e7a74e',
        night: '#171426',
        blush: '#ffe5ed',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        script: ['Caveat', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
