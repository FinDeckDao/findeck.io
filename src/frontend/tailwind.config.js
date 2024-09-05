import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tailwind-datepicker-react/dist/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        // Dark bg color for the header and medium for the rest
        'dark': '#0d0d0d',
        'medium': '#1a1a1a',
      },
      fontFamily: {
        // Adding Inter font
        sans: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [daisyui, '@tailwindcss/aspect-ratio']
}
