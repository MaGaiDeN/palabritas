/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'flip-in': {
          '0%': { transform: 'rotateX(0deg)', opacity: '0' },
          '100%': { transform: 'rotateX(360deg)', opacity: '1' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'flip-in': 'flip-in 0.6s ease-in-out',
        'bounce-in': 'bounce-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out'
      }
    },
  },
  plugins: [],
}