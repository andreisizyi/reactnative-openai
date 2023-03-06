/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./resources/**/*.{js,jsx,ts,tsx}",
    "./partials/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Not required for standart
        // 'bold': 'Roboto_700Bold',
        // 'regular': 'Roboto_400Regular',
        'test': 'Roboto_700Bold'
      }
    },
  },
  plugins: [],
}