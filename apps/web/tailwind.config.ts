import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

// ANZ Agricrop Brand Guidelines — "Harvest Premium" working palette.
// This is the only place these values appear.
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        forest: '#002B1D', // Forest Green
        leaf: '#72B943', // Leaf Green
        lime: '#B9D94B', // Lime Leaf
        gold: '#E4A72A', // Harvest Gold
        cream: '#FFF8E8', // Wheat Cream
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '40%': { transform: 'translateX(2px) rotate(1deg)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg) translateX(0)' },
          '15%': { transform: 'rotate(-1.5deg) translateX(-4px)' },
          '30%': { transform: 'rotate(1.5deg) translateX(4px)' },
          '45%': { transform: 'rotate(-1deg) translateX(-3px)' },
          '60%': { transform: 'rotate(1deg) translateX(3px)' },
          '75%': { transform: 'rotate(-0.5deg) translateX(-1px)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        wave: 'wave 0.9s ease-in-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config
