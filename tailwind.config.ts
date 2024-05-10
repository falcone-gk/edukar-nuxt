import type { Config } from 'tailwindcss'

const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")

export default <Partial<Config>>{
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["ri"])
    })
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'silver-tree': {
          '50': '#effaf5',
          '100': '#d8f3e6',
          '200': '#b4e6d0',
          '300': '#83d2b5',
          '400': '#4cb692',
          '500': '#2d9c7a',
          '600': '#1e7d61',
          '700': '#186450',
          '800': '#155040',
          '900': '#124236',
          '950': '#09251f',
        },
        secondary: 'rgb(var(--secondary-color) / <alpha-value>)',
        'dark-accent': 'rgb(var(--dark-accent-color) / <alpha-value>)',
        'accent': 'rgb(var(--accent-color) / <alpha-value>)'
      }
    }
  }
}
