/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444',
        secondary: '#1a2e1a',
        accent: '#00ff00',
        dark: '#070101',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        tech: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'scanline': 'scanline 2s linear infinite',
        'glitch': 'glitch 0.3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'hologram': 'hologramRotate 4s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'energy': 'energyPulse 2s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { clipPath: 'inset(40% 0 61% 0)', transform: 'translate(-20px, -10px)' },
          '20%': { clipPath: 'inset(92% 0 1% 0)', transform: 'translate(20px, 10px)' },
          '40%': { clipPath: 'inset(43% 0 1% 0)', transform: 'translate(-20px, 10px)' },
          '60%': { clipPath: 'inset(25% 0 58% 0)', transform: 'translate(20px, -10px)' },
          '80%': { clipPath: 'inset(54% 0 7% 0)', transform: 'translate(-20px, 10px)' },
          '100%': { clipPath: 'inset(58% 0 43% 0)', transform: 'translate(20px, -10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        hologramRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        energyPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
} 