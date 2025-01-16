// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@nuxt/scripts',
    '@sidebase/nuxt-auth',
  ],

  auth: {
    baseURL: 'http://patrik.ml:3000/api/auth',
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'google',
      addDefaultCallbackUrl: true
    }
  },

  googleFonts: {
    families: {
      // Inter: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      // Jost: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
    }
  },

  i18n: {
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    defaultLocale: 'ru',
    locales: [
      {
        code: 'ru',
        file: 'ru-RU.json',
      },
      {
        code: 'en',
        file: 'en-US.json'
      }
    ],
    detectBrowserLanguage: false,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      mail: '',
      phone: '',
      baseUrl: '',
    },
    adminEmails: '',
    auth: {
      secret: '',
      providers: {
        google: {
          client: '',
          secret: ''
        },
      }
    },
    postgresUrl: '',
    redis: {
      password: '',
      port: ''
    },
    notify: {
      smtp: {
        host: '',
        user: '',
        password: '',
      }
    }
  },

  image: {
    provider: 'ipx',
    domains: [
      process.env.NUXT_PUBLIC_BASE_URL || 'http://patrik.ml:3000'
    ],
    alias: {
      fs: `${process.env.NUXT_PUBLIC_BASE_URL}/api/media`
    }
  },

  imports: {
    dirs: [
      './types'
    ]
  },

  nitro: {
    routeRules: {
      '/api/**': { ssr: false },
      // '/_ipx/**': { headers: { 'cache-control': `public,max-age=691200,s-maxage=691200` } },
    },
    imports: {
      dirs: [
        './server/db',
        './server/repositories',
        './server/services',
        './server/entities',
        './server/handlers',
        './app/utils',
        './types',
      ]
    },
    storage: {
      redis: {
        driver: 'redis',
        host: process.env.NUXT_REDIS_HOST,
        port: process.env.NUXT_REDIS_PORT,
        password: process.env.NUXT_REDIS_PASSWORD
      },
      media: {
        driver: 'fs',
        base: './media'
      }
    },
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      // https://crontab.guru
      // '*/20 * * * *': ['posts:update']
    }
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'in-out',
    },
    // layoutTransition: {
    //   name: 'layout',
    //   mode: 'in-out'
    // },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
      ],
      // link: [{ rel: 'icon', type: 'image/webp', href: '/favicon.webp' }],
    }
  },

  experimental: {
    writeEarlyHints: false,
  },

  ssr: true,

  routeRules: {
    '/admin/**': {
      ssr: false
    },
    '/aktsii/**': {
      redirect: {
        to: '/blog_o_geraldike/**',
        statusCode: 301
      },
      static: true
    },
    '/geraldika-v-zhizni/**': {
      redirect: {
        to: '/blog_o_geraldike/**',
        statusCode: 301
      },
      static: true
    },
    '/zapisi-geraldista/**': {
      redirect: {
        to: '/blog_o_geraldike/**',
        statusCode: 301
      },
      static: true
    },
    '/kompetentnoe-mnenie/**': {
      redirect: {
        to: '/blog_o_geraldike/**',
        statusCode: 301
      },
      static: true
    },
    '/news/**': {
      redirect: {
        to: '/blog_o_geraldike/**',
        statusCode: 301
      },
      static: true
    },
    '/aktsii/': {
      redirect: {
        to: '/blog_o_geraldike/category/aktsii/',
        statusCode: 301
      },
      static: true
    },
    '/geraldika-v-zhizni/': {
      redirect: {
        to: '/blog_o_geraldike/category/geraldika-v-zhizni/',
        statusCode: 301
      },
      static: true
    },
    '/zapisi-geraldista/': {
      redirect: {
        to: '/blog_o_geraldike/category/zapisi-geraldista/',
        statusCode: 301
      },
      static: true
    },
    '/kompetentnoe-mnenie/': {
      redirect: {
        to: '/blog_o_geraldike/category/kompetentnoe-mnenie/',
        statusCode: 301
      },
      static: true,
    },
    '/news/': {
      redirect: {
        to: '/blog_o_geraldike/category/news/',
        statusCode: 301
      },
      static: true
    },
    '/aktsii/page/**': {
      redirect: {
        to: '/blog_o_geraldike/category/aktsii/page/**',
        statusCode: 301
      },
      static: true
    },
    '/geraldika-v-zhizni/page/**': {
      redirect: {
        to: '/blog_o_geraldike/category/geraldika-v-zhizni/page/**',
        statusCode: 301
      },
      static: true
    },
    '/zapisi-geraldista/page/**': {
      redirect: {
        to: '/blog_o_geraldike/category/zapisi-geraldista/page/**',
        statusCode: 301
      },
      static: true
    },
    '/kompetentnoe-mnenie/page/**': {
      redirect: {
        to: '/blog_o_geraldike/category/kompetentnoe-mnenie/page/**',
        statusCode: 301
      },
      static: true
    },
    '/news/page/**': {
      redirect: {
        to: '/blog_o_geraldike/category/news/page/**',
        statusCode: 301
      },
      static: true
    },
    '/heraldist-notes/**': {
      redirect: {
        to: '/blog_o_geraldike/**',
        statusCode: 301
      },
      static: true
    },
    '/portfolio': {
      redirect: {
        to: '/portfolio/gerbs',
        statusCode: 301
      },
      static: true
    },
    // '/_ipx/**': {
    //   cache: {
    //     maxAge: 2000
    //   }
    // }
  },

  future: {
    compatibilityVersion: 4
  },
})