/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FF69B4',      // Hot Pink - more vibrant
          lavender: '#B57EDC',  // Medium Purple - richer
          mint: '#00E5A0',      // Bright Mint - more saturated
          peach: '#FFB347',     // Bright Peach - warmer
          sky: '#4FC3F7',       // Bright Sky Blue - more vivid
          lilac: '#DA70D6',     // Orchid - more vibrant
        },
      },
    },
  },
  plugins: [],
}

