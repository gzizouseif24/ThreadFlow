/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#E8A5C0',      // Softer pink - reduced brightness
          lavender: '#A89BC7',  // Muted lavender - less saturated
          mint: '#8FD5C1',      // Softer mint - reduced contrast
          peach: '#E5C4A1',     // Muted peach - warmer but softer
          sky: '#A8D5E2',       // Softer sky blue - less vivid
          lilac: '#C9A8D4',     // Softer lilac - reduced vibrancy
        },
        dark: {
          bg: '#0f172a',        // Dark slate background
          surface: '#1e293b',   // Slightly lighter surface
          card: '#334155',      // Card background
          border: '#475569',    // Border color
          text: '#e2e8f0',      // Primary text
          muted: '#94a3b8',     // Muted text
        },
      },
    },
  },
  plugins: [],
}

