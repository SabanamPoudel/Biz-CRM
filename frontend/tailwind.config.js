/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#e7edfc',
          'dark': '#003174',
          'accent': '#c51111',
          'light': '#f8faff',
          'blue': '#0052b4',
        },
      },
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(0, 49, 116, 0.1), 0 2px 4px -1px rgba(0, 49, 116, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(0, 49, 116, 0.1), 0 4px 6px -2px rgba(0, 49, 116, 0.05)',
      },
    },
  },
  plugins: [],
}
