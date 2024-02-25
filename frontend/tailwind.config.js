/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'scale(.25)' },
          '100%': { fontSize: 'scale(1)' },
        },
      },
      animation: {
        slideIn20: 'slideIn .20s ease-in-out',
        slideIn25: 'slideIn .25s ease-in-out',
        slideIn35: 'slideIn .35s ease-in-out',
        slideIn45: 'slideIn .45s ease-in-out',
      },
    },
  },
  plugins: [],
};
