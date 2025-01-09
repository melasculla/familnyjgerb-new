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
            single: (slug: string) => `/admin/posts/${slug}`,
         },
         projects: {
            list: '/admin/projects',
            single: (slug: string) => `/admin/projects/${slug}`,
         },
         images: {
            upload: '/admin/uploadImages',
         },
      },
      posts: {
         list: '/blog_o_geraldike',
         single: (slug: string) => `/blog_o_geraldike/${slug}`,
         category: (slug: string) => `/blog_o_geraldike/category/${slug}`,
      },
      policy: '/policy'
   },
   api: {
      posts: {
         getAll: '/api/posts',
         getSingle: (slug: string) => `/api/posts/${slug}` as const,
         create: '/api/posts/create',
         edit: '/api/posts/edit',
         delete: '/api/posts/delete',
      },
      mail: {
         send: '/api/mail/send'
      },
      media: {
         images: {
            list: '/api/media/images/',
            upload: '/api/media/images/',
         },
         getFile: (file: string) => `${useRequestURL().origin}/api/media/${file}` as const,
      },
   } as const,
}