/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': 'rgb(14 23 103 / 36%)',
        'custom-darkblue': 'rgb(57 56 100 / 38%)'
      }
    },
  },
  plugins: [],
}

