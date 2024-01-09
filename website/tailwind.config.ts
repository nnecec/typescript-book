import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', 'node_modules/@color-kit/**/*'],
  plugins: [],
  theme: {
    extend: {},
  },
} satisfies Config
