/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#E0E5EC',
          fg: '#3D4852',
          muted: '#6B7280',
          accent: '#6C63FF',
          'accent-light': '#8B84FF',
          teal: '#38B2AC',
          dark: '#2D3748',
          shadowLight: 'rgba(255, 255, 255, 0.6)',
          shadowDark: 'rgba(163, 177, 198, 0.65)',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'neu-extruded': '9px 9px 16px rgba(163, 177, 198, 0.65), -9px -9px 16px rgba(255, 255, 255, 0.6)',
        'neu-extruded-hover': '12px 12px 20px rgba(163, 177, 198, 0.75), -12px -12px 20px rgba(255, 255, 255, 0.7)',
        'neu-extruded-sm': '5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.6)',
        'neu-inset': 'inset 6px 6px 10px rgba(163, 177, 198, 0.65), inset -6px -6px 10px rgba(255, 255, 255, 0.6)',
        'neu-inset-deep': 'inset 10px 10px 20px rgba(163, 177, 198, 0.75), inset -10px -10px 20px rgba(255, 255, 255, 0.7)',
        'neu-inset-sm': 'inset 3px 3px 6px rgba(163, 177, 198, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.6)',
        'neu-accent': '9px 9px 16px rgba(108, 99, 255, 0.35), -9px -9px 16px rgba(255, 255, 255, 0.5)',
        'neu-teal': '9px 9px 16px rgba(56, 178, 172, 0.35), -9px -9px 16px rgba(255, 255, 255, 0.5)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
