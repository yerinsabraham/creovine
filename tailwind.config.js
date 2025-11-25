/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B1F30',
        background: '#15293A',
        popup: '#214055',
        green: '#29BD98',
        textSecondary: '#658CA7',
        blue: '#2497F9',
        darkGray: '#466E8A',
        lightGray: '#9FBBCD',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'button-gradient': 'linear-gradient(135deg, #14789D 0%, #2BC398 100%)',
        'rate-gradient': 'linear-gradient(135deg, #2BC398 0%, #2497F9 100%)',
      },
    },
  },
  plugins: [],
}
