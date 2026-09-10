import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cm: {
          bg: '#0A0E27',
          primary: '#2C2A8C',
          primaryDark: '#161550',
          accent: '#38B6E0',
        },
      },
    },
  },
  plugins: [],
};

export default config;
