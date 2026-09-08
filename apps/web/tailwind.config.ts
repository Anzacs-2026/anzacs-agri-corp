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
    },
  },
  plugins: [animate],
} satisfies Config
