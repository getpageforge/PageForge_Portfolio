/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'bg-primary': '#000000',
        'bg-secondary': '#050505',
        'card': '#0A0A0A',
        'border': '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A3A3A3',
        'accent': '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"SF Pro Display"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', 'monospace'],
      },
      maxWidth: {
        'site': '1280px',
      },
      spacing: {
        'section-desktop': '120px',
        'section-tablet': '48px',
        'section-mobile': '24px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'counter': 'counter 2s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
        'radial-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.06), transparent)',
      },
    },
  },
  plugins: [],
}
