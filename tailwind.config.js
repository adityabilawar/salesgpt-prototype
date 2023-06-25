/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#6100FF",
        brandOrange: "#FFBE38",
        brandOrangeSecondary: "#FF7343",
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

