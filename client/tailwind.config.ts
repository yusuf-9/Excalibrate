import type { Config } from 'tailwindcss'

const generateColorClass = (variable: string) => {
      return `rgb(var(--${variable}))`
}

const primary = {
  primary: generateColorClass('primary'),
  'primary-light': generateColorClass('primary-light'),
  'primary-dark': generateColorClass('primary-dark'),
}

const contrast = {
  contrast: generateColorClass('contrast'),
  'contrast-light': generateColorClass('contrast-light'),
  'contrast-dark': generateColorClass('contrast-dark'),
}

const accent = {
  accent: generateColorClass('accent'),
  'accent-dark': generateColorClass('accent-dark'),
  'accent-darker': generateColorClass('accent-darker'),
}

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        ...primary,
        ...contrast,
        ...accent
      }
    },
  },
  plugins: [],
}
export default config