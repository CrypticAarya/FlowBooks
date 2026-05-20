/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#020617',
        card: '#0F172A',
        border: '#1E293B',
        accent: '#22C55E',
        muted: '#94A3B8',
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 197, 94, 0.12)',
      },
    },
  },
  plugins: [],
}
