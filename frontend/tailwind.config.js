export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient':   'gradientShift 6s ease infinite',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-24px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(139,92,246,0.4)' },
          '50%':     { boxShadow: '0 0 50px rgba(139,92,246,0.8), 0 0 100px rgba(139,92,246,0.3)' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
