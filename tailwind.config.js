/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', ...require('tailwindcss/defaultTheme').fontFamily.sans],
        'merriweather': ['Merriweather', 'sans-serif'],
      },
      colors: {
        qmat1: "#f0596c",
        qmat2: "#824894"
      },
    },
  },
  plugins: [],
}