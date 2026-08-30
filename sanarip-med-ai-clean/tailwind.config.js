/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#09638D',
          blueHover: '#075174',
          teal: '#09638D',
          cyan: '#61DED3',
          bg: '#F3F5F9',
          card: '#FFFFFF',
          textDark: '#0F172A',
          textMuted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'curelink': '0 25px 50px -12px rgba(28, 100, 242, 0.18)',
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
