/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LMSA Brand Colors (WCAG AA compliant)
        lmsa: {
          50: '#E8F7F0',
          100: '#C1E8D6',
          200: '#9ADABC',
          400: '#4DB68E',
          500: '#29A37D',
          600: '#0C8950', // Primary brand color
          700: '#0A7343',
          800: '#085C36',
          900: '#064629',
        },
        // Supporting colors
        red: {
          50: '#FEF0F0',
          100: '#FDD8D8',
          400: '#F88B8B',
          600: '#DC143C', // Liberian flag red
          800: '#A00F2D',
        },
        blue: {
          50: '#E6F2FF',
          100: '#B8DAFF',
          400: '#4D9FFF',
          600: '#1976D2', // Academic blue
          800: '#0D5AA7',
        },
        amber: {
          50: '#FFF8E1',
          100: '#FFECB3',
          400: '#FFCA28',
          600: '#FFB300', // Achievement gold
          800: '#C68400',
        },
        // Teal — Fresh & Modern (Healthcare/Info)
        teal: {
          50: '#E6FFFA',
          100: '#B2F5EA',
          400: '#38B2AC',
          500: '#319795',
          600: '#2C7A7B',
          700: '#285E61',
          800: '#234E52',
        },
        // Purple — Premium & Distinctive (Leadership/Executive)
        purple: {
          50: '#FAF5FF',
          100: '#E9D5FF',
          400: '#A855F7',
          500: '#9333EA',
          600: '#7E22CE',
          700: '#6B21A8',
          800: '#581C87',
        },
        // Orange — Energy & Community (Events/CTAs)
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
        },
        // Rose — Human & Approachable (Welfare/Wellness)
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
        },
        // Full grayscale (for better contrast control)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': '48px',
      },
    },
  },
  plugins: [],
}