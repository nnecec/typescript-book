import type { Config } from 'tailwindcss'

import starlightPlugin from '@astrojs/starlight-tailwind'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', 'node_modules/@color-kit/**/*'],
  plugins: [starlightPlugin()],
  theme: {
    extend: {},
  },
} satisfies Config
