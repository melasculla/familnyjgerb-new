import { joinURL } from 'ufo'

/**
 * List Routes
*/
export default {
   client: {

      admin: {
         main: '/admin',
         users: {
            list: '/admin/users'
         },
         posts: {
            list: '/admin/posts',
            create: '/admin/posts/create',
            category: (category: string) => `/admin/posts/${category}`,
            single: (slug: string, id: number) => `/admin/posts/${slug}__${id}`,
         },
         categories: '/admin/categories',
         projects: {
            list: '/admin/projects',
            create: '/admin/projects/create',
            single: (slug: string, id: number) => `/admin/projects/${slug}__${id}`,
         },
         gallery: {
            list: '/admin/gallery',
            category: {
               list: (gallery: string) => `/admin/gallery/${gallery}`,
               single: (gallery: string, category: string) => `/admin/gallery/${gallery}/${category}`
            },
         },
         images: {
            upload: '/admin/upload',
         },
      },

      gallery: {
         gerbs: '/portfolio/gerbs',
         monograms: '/portfolio/monograms',
      },

      posts: {
         list: '/blog_o_geraldike',
         page: (page?: number) => page ? `/blog_o_geraldike/page/${page}` : '/blog_o_geraldike',
         single: (slug: string) => `/blog_o_geraldike/${slug}`,
         category: (slug: string) => `/blog_o_geraldike/category/${slug}`,
         categoryPage: (slug: string) => (page?: number) => page ? `/blog_o_geraldike/category/${slug}/page/${page}` : `/blog_o_geraldike/category/${slug}`,
      },

      projects: {
         list: '/portfolio/list',
         page: (page?: number) => page ? `/portfolio/list?page=${page}` : '/portfolio/list',
         single: (slug: string) => `/portfolio/${slug}`
      },

      static: {
         survey: '/anketirovanie',
         contacts: '/nashi-kontakty',
         services: {
            home: '/o-sajte',
            gerbs: '/o-sajte/razrabotka-gerba-2',
            korp_gerbs: '/o-sajte/razrabotka-korporativnyih-gerbov',
            ter_gerbs: '/o-sajte/razrabotka-territorialnoy-geraldiki',
            gerb_restore: '/o-sajte/vosstanovlenie-izobrazheniya-gerba',
            graphic: '/o-sajte/cennye-bumagi',
            tree: '/o-sajte/genealogicheskoe-drevo',
            monograms: '/o-sajte/razrabotka-monogramm',
            wedding_monograms: '/o-sajte/razrabotka-monogramm/razrabotka-svadebnyih-monogramm',
            noble_restore: '/o-sajte/vosstanovlenie-dvoryanstva',
         },
         reviews: '/otzyivyi',
         cert: '/sertifikat-geraldicheskoy-masterskoy',
         souvenirs: '/suvenirnaya-i-podarochnaya-geraldika',
         policy: '/policy',
         terms: '/terms',
      },
   } as const,

   /**
    * API ROUTES
   */
   api: {

      posts: {
         // getAll: 'http://patrik.ml:8080/posts',
         getAll: '/api/posts',
         getSingle: (slug: string) => `/api/posts/${slug}` as const,
         create: '/api/posts/create',
         edit: '/api/posts/edit',
         delete: '/api/posts/delete',
      },

      categories: {
         getAll: '/api/categories',
         create: '/api/categories/create',
         edit: '/api/categories/edit',
         delete: '/api/categories/delete',
      },

      projects: {
         getAll: '/api/projects',
         getSingle: (slug: string) => `/api/projects/${slug}` as const,
         create: '/api/projects/create',
         edit: '/api/projects/edit',
         delete: '/api/projects/delete',
      },

      gallery: {
         list: '/api/gallery',
         main: '/api/gallery/main',
         category: {
            list: (gallery: string) => `/api/gallery/${gallery}` as const,
            single: (gallery: string, category: string) => `/api/gallery/${gallery}/${category}` as const
         },
         items: {
            upsert: (gallery: string, category: string) => `/api/gallery/${gallery}/${category}/items/upsert` as const,
            delete: (gallery: string, category: string) => `/api/gallery/${gallery}/${category}/items/delete` as const,
         }
      },

      mail: {
         send: '/api/mail/send'
      },

      media: {
         list: '/api/media/index',
         images: {
            list: '/api/media/images/',
            upload: '/api/media/images/',
         },
         match: (route: string) => joinURL('/api/media/', route) as `/api/media/${string}`,
         getFile: (file: string) => joinURL('/api/media/', file) as `/api/media/${string}`,
      },

   } as const,
}