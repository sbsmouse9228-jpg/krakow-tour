/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 크라쿠프 구시가지 벽돌/황토색 톤을 메인 컬러로 사용
        brand: {
          50: '#fdf6ec',
          100: '#f8e8cc',
          200: '#efce99',
          300: '#e5ac5c',
          400: '#dd9038',
          500: '#c9741f',
          600: '#a85818',
          700: '#854318',
          800: '#6c3819',
          900: '#5c3018',
        },
      },
    },
  },
  plugins: [],
};
