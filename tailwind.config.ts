import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#FAF8F5', // Warm ivory background
          card: '#FFFFFF',    // Pure white cards
          muted: '#F4EFEA',   // Secondary surface
          subtle: '#EFE9E1',  // Subtle dividers
          border: '#E7E3DC',  // Warm border token
          dark: '#0B132B',    // Slate navy surface
        },
        navy: {
          50: '#F0F3F9',
          100: '#D9E2F2',
          200: '#B3C5E6',
          300: '#8DA7D9',
          400: '#5F83C7',
          500: '#3D62AD',
          600: '#384D6E',     // Muted text (>6:1 contrast against #FAF8F5)
          700: '#283C66',
          800: '#1C2A4A',     // Secondary body text (>11:1 contrast)
          900: '#111C3D',
          950: '#0B132B',     // Deep dark navy primary text (>16:1 contrast)
        },
        brandTeal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          500: '#14B8A6',
          600: '#0D9488',     // Primary interactive accent
          700: '#0F766E',     // Accent hover / primary button (>4.5:1 contrast against surface)
          800: '#115E59',
          900: '#134E4A',
        },
        brandAmber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#F59E0B',
          600: '#D97706',     // Unconfirmed details & warning badge accent
          700: '#B45309',     // Accessible text amber (>4.5:1 contrast)
          800: '#92400E',
          900: '#78350F',
        },
        brandGreen: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',     // Hover green accent (>5:1 contrast)
          800: '#166534',     // Primary green interactive accent (>7:1 contrast)
          900: '#14532D',
          950: '#052E16',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Courier New',
          'monospace',
        ],
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};

export default config;
