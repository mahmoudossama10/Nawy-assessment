import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8ff',
          100: '#dcebff',
          200: '#b7d5ff',
          300: '#88b7ff',
          400: '#5b93ff',
          500: '#356eff',
          600: '#1f51db',
          700: '#183faa',
          800: '#163788',
          900: '#152f6e'
        }
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;

