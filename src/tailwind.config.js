/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Look for Tailwind classes in all JS/JSX/TS/TSX files inside src
      "./public/index.html",        // Also scan your index.html for classes
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1CBA6A',   // example custom color
          secondary: '#15925B',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'], // custom font family
        },
      },
    },
    plugins: [],
  }
  