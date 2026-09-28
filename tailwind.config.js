/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maxblue: '#3F87F5',
        maxbg: '#F4F6F8',
        maxbubble: '#FFFFFF',
        maxbubbleOut: '#DCEBFF',
      },
    },
  },
  plugins: [],
};
