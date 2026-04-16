/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        taski: {
          dark: '#0A0E1A',
          navy: '#0F1629',
          blue: '#1A2744',
          accent: '#4F8EF7',
          gold: '#F5A623',
          cyan: '#00D4FF',
          green: '#00E5A0',
        },
      },
    },
  },
  plugins: [],
}
