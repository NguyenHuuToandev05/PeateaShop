/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50:  '#FFF0F5',
          100: '#FFE0EC',
          200: '#FFC2D4',
          300: '#FF9EBD',
          400: '#FF7AA8',
          500: '#E91E8C',
          600: '#D4187E',
          700: '#B01268',
          800: '#8C0D52',
          900: '#68083C',
        },
        lavender: {
          100: '#F3EEFF',
          200: '#E5D5FF',
          300: '#C9AAFF',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FFE0EC 0%, #F3EEFF 50%, #FFE0EC 100%)',
        'taobao-gradient': 'linear-gradient(135deg, #C9AAFF 0%, #FFB3D4 100%)',
      }
    },
  },
  plugins: [],
}
