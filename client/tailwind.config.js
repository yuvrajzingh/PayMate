/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(62,102,189,0.5) 100%), url("/src/bg-img.jpg")'
      },
    },
  },
  plugins: [],
}