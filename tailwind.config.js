/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        brand: {
          DEFAULT: '#00e5a0',
          dark:    '#00b87a',
          glow:    'rgba(0,229,160,0.18)',
        },
        surface: {
          900: '#07090f',
          800: '#0d1117',
          700: '#111827',
          600: '#1a2233',
          500: '#222d42',
          400: '#2d3a52',
          300: '#3a4a66',
        },
        danger:  '#f43f5e',
        warning: '#fbbf24',
        info:    '#38bdf8',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'pitch-gradient': 'radial-gradient(ellipse at 50% 60%, #0d2818 0%, #07090f 70%)',
        'hero-gradient':  'radial-gradient(ellipse at 30% 50%, #001f12 0%, #07090f 60%)',
        'card-gradient':  'linear-gradient(135deg, #111827 0%, #0d1117 100%)',
      },
      boxShadow: {
        brand:  '0 0 24px rgba(0,229,160,0.2)',
        card:   '0 4px 24px rgba(0,0,0,0.5)',
        glow:   '0 0 40px rgba(0,229,160,0.12)',
        danger: '0 0 20px rgba(244,63,94,0.2)',
      },
      keyframes: {
        pulse_brand: {
          '0%,100%': { boxShadow: '0 0 12px rgba(0,229,160,0.3)' },
          '50%':     { boxShadow: '0 0 28px rgba(0,229,160,0.6)' },
        },
        slide_up: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fade_in: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        scan: {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      animation: {
        pulse_brand: 'pulse_brand 2s ease-in-out infinite',
        slide_up:    'slide_up 0.4s ease forwards',
        fade_in:     'fade_in 0.5s ease forwards',
        scan:        'scan 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
