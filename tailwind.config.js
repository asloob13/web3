const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Indian Flag Colors
        'saffron': {
          50: '#fef7ed',
          100: '#fdead5',
          200: '#fad1aa',
          300: '#f6b074',
          400: '#f1853c',
          500: '#ed6616',
          600: '#de4f0c',
          700: '#b93a0c',
          800: '#932f10',
          900: '#762810',
        },
        'white': {
          50: '#ffffff',
          100: '#fefefe',
          200: '#fefefe',
          300: '#fdfdfd',
          400: '#fcfcfc',
          500: '#fafafa',
          600: '#f5f5f5',
          700: '#e5e5e5',
          800: '#d4d4d4',
          900: '#a3a3a3',
        },
        'green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // System Colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
        gujarati: ['Noto Sans Gujarati', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
        malayalam: ['Noto Sans Malayalam', 'sans-serif'],
        oriya: ['Noto Sans Oriya', 'sans-serif'],
        punjabi: ['Noto Sans Gurmukhi', 'sans-serif'],
        assamese: ['Noto Sans Bengali', 'sans-serif'],
        marathi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'pulse-success': {
          '0%, 100%': { borderColor: '#22c55e' },
          '50%': { borderColor: '#86efac' },
        },
        'pulse-error': {
          '0%, 100%': { borderColor: '#ef4444' },
          '50%': { borderColor: '#fca5a5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'pulse-success': 'pulse-success 2s ease-in-out infinite',
        'pulse-error': 'pulse-error 2s ease-in-out infinite',
      },
      screens: {
        'xs': '475px',
        'feature-phone': '240px',
        'accessibility': { 'raw': '(min-width: 320px) and (prefers-reduced-motion: no-preference)' },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      fontSize: {
        'accessibility-min': '18px',
        'accessibility-large': '24px',
        'accessibility-xl': '32px',
      },
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    // Custom plugin for accessibility
    function({ addUtilities }) {
      const newUtilities = {
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },
        '.focus-ring': {
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'hsl(var(--ring))',
            outlineOffset: '2px',
          },
        },
        '.skip-link': {
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          padding: '8px 16px',
          borderRadius: '4px',
          textDecoration: 'none',
          zIndex: '9999',
          '&:focus': {
            top: '20px',
          },
        },
        '.high-contrast': {
          filter: 'contrast(1.5)',
        },
        '.reduce-motion': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};