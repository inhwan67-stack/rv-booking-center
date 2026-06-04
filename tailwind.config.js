/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef5ff',
          100: '#d9e9ff',
          700: '#14345f',
          800: '#0d284d',
          900: '#081c38',
        },
        signal: {
          orange: '#f97316',
          blue: '#2563eb',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(8, 28, 56, 0.10)',
      },
    },
  },
  plugins: [],
};
