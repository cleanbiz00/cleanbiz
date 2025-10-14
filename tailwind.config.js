/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cleanbiz': {
          50: '#e0f7fa',
          100: '#b2f5ea',
          200: '#81e6d9',
          300: '#4fd1c7',
          400: '#38b2ac',
          500: '#14b8a6',
          600: '#06b6d4',
          700: '#0891b2',
          800: '#0e7490',
          900: '#164e63',
        },
        'cleanbiz-dark': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      backgroundImage: {
        'cleanbiz-gradient': 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
        'cleanbiz-gradient-dark': 'linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)',
      }
    },
  },
  plugins: [],
}