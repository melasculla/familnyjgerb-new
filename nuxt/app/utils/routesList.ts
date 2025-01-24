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

      policy: '/policy'
   } as const,

   /**
    * API ROUTES
   */
   api: {

      posts: {
         getAll: '/api/posts',
         getSingle: (slug: string) => `/api/posts/${slug}` as const,
         create: '/api/posts/create',
         edit: '/api/posts/edit',
         delete: '/api/posts/delete',
      },

      categories: {
         getAll: '/api/categories'
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