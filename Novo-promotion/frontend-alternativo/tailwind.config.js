/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Lexend', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#173d31', 600: '#2b5a4a' },
        accent: '#f2b632',
        surface: '#f4f5f1',
        line: '#dfe3dc',
        field: '#d7dcd4',
        zebra: '#eef0ea',
        ink: '#1a2e27',
        body: '#4b5a52',
        muted: '#5d6b62',
        faint: '#8a968e',
        sub: '#cfdcd5',
        soft: { DEFAULT: '#e3eee6', ink: '#2e5a47' },
        warn: { DEFAULT: '#fbe7d6', ink: '#9a4a12' },
        danger: { DEFAULT: '#b23a2c', soft: '#f3e1de', line: '#e3b4ae' },
      },
      boxShadow: { panel: '0 20px 50px rgba(20,40,30,.25)' },
      backgroundImage: {
        backdrop: 'repeating-linear-gradient(135deg,#c9d3c4 0 14px,#c2ccbd 14px 28px)',
        placeholder: 'repeating-linear-gradient(135deg,#eef0ea 0 10px,#e6e9e2 10px 20px)',
      },
    },
  },
  plugins: [],
};