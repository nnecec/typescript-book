import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  integrations: [
    /** @type {import('@astro/starlight').StarlightUserConfigWithPlugins} */
    starlight({
      customCss: ['./src/styles/global.css'],
      head: [
        process.env.NODE_ENV === 'production' && {
          attrs: {
            'data-endpoint': 'https://datapulse.app/api/v1/event',
            'data-workspace': 'clr7hhiaf3q51dk32cl5xyw93',
            defer: true,
            id: 'datapulse',
            src: 'https://datapulse.app/datapulse.min.js',
            type: 'text/javascript',
          },
          tag: 'script',
        },
        {
          attrs: {
            href: '/apple-touch-icon.png',
            rel: 'apple-touch-icon',
            sizes: '180x180',
          },
          tag: 'link',
        },
        {
          attrs: {
            href: '/favicon-32x32.png',
            rel: 'icon',
            sizes: '32x32',
            type: 'image/png',
          },
          tag: 'link',
        },
        {
          attrs: {
            href: '/favicon-16x16.png',
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
          },
          tag: 'link',
        },
        {
          attrs: {
            href: '/site.webmanifest',
            rel: 'manifest',
          },
          tag: 'link',
        },
      ].filter(Boolean),
      locales: {
        // English docs in `src/content/docs/en/`
        root: {
          label: 'English',
          lang: 'en',
        },
        // Simplified Chinese docs in `src/content/docs/zh-cn/`
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      sidebar: [
        {
          autogenerate: { directory: 'books' },
          label: 'TypeScript Book',
        },
      ],
      social: {
        github: 'https://github.com/gibbok/typescript-book',
        'x.com': 'https://x.com/nnecec_cn',
      },
      title: 'TypeScript Book',
    }),
    tailwind(),
    react(),
  ],
})
