/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        quantum: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
        },
        cyber: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
        aqua: {
          50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9',
          400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490',
          800: '#155e75', 900: '#164e63',
        },
        navy: {
          900: '#070713', 950: '#04040d',
        },
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.06) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgba(129,140,248,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(129,140,248,0.07) 1px, transparent 1px)',
        'radial-quantum':
          'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.18), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(99, 102, 241, 0.45)',
        'glow-blue': '0 0 40px -10px rgba(59, 130, 246, 0.45)',
        'glow-cyan': '0 0 40px -10px rgba(34, 211, 238, 0.45)',
        'glow-lg': '0 0 60px -12px rgba(99, 102, 241, 0.55)',
        'glow-emerald': '0 0 40px -10px rgba(16, 185, 129, 0.45)',
        'glow-rose': '0 0 40px -10px rgba(244, 63, 94, 0.45)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseGlow: { '0%, 100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        ripple: { '0%': { transform: 'scale(0)', opacity: '0.5' }, '100%': { transform: 'scale(4)', opacity: '0' } },
        gradientShift: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        scanLine: { '0%': { top: '0%' }, '100%': { top: '100%' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        borderGlow: {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(99,102,241,0.3)' },
          '50%': { boxShadow: '0 0 35px -3px rgba(99,102,241,0.6)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        spinSlow: 'spinSlow 18s linear infinite',
        ripple: 'ripple 0.6s ease-out',
        gradientShift: 'gradientShift 6s ease infinite',
        scanLine: 'scanLine 2s ease-in-out infinite alternate',
        fadeUp: 'fadeUp 0.5s ease-out',
        borderGlow: 'borderGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
