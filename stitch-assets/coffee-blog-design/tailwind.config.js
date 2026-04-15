/**
 * The Editorial Muse - Tailwind Config
 * Based on Design System: The Artisanal Archive
 */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy
        background: '#fcf9f4',
        'surface-low': '#f6f3ee',
        'surface-lowest': '#ffffff',
        'surface-high': '#ebe8e3',

        // Primary (roasted coffee tones)
        primary: '#361f1a',
        'primary-container': '#4e342e',

        // Secondary (muted earth tones)
        secondary: '#5c614d',
        'secondary-container': '#e0e5cc',

        // On colors
        'on-surface': '#1c1c19',
        'on-primary': '#ffffff',
        'on-secondary-container': '#626753',

        // Outline
        'outline-variant': '#d4c3bf',
      },

      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },

      fontSize: {
        display: ['3.5rem', { letterSpacing: '-0.02em', lineHeight: '1.1' }],
        'headline-lg': ['2rem', { fontWeight: '600', lineHeight: '1.2' }],
        'title-lg': ['1.375rem', { fontWeight: '500', lineHeight: '1.4' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        label: ['0.75rem', { textTransform: 'uppercase', letterSpacing: '0.05em' }],
      },

      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },

      boxShadow: {
        'ambient': '0 4px 40px rgba(28, 28, 25, 0.06)',
      },

      backgroundImage: {
        'signature-gradient': 'linear-gradient(135deg, #361f1a 0%, #4e342e 100%)',
      },
    },
  },
  plugins: [],
};
