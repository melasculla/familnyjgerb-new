/**
 * List Routes
*/
export default {
   /**
   * Client
   */

   //  Static pages
   webDevelopment: '/web-development',
   webDesign: '/web-design',
   contacts: '/contacts',
   about: '/about-us',
   faq: '/faq',
   favorites: '/favorites',
   policy: '/policy',
   terms: '/terms',

   // User
   profile: '/profile',

   // Admin
   admin: '/admin',
   users: '/admin/users',
   adminUploadImages: '/admin/uploadImages',

   // Porfolio
   getPortfolioAdmin: '/admin/portfolio',
   adminEditPortfolio: (slug: string) => `/admin/portfolio/edit-${slug}`,
   adminCreatePortfolio: '/admin/portfolio/create',
   getPortfolioClient: (page?: number) => page ? `/portfolio?page=${page}` : '/portfolio',
   getSinglePortfolioClient: (slug: string) => `/portfolio/${slug}`,

   // Admin Users
   sketch: (uid: string, id: number) => `/admin/users/${uid}/sketches/${id}`,
   sketchCreate: (uid: string) => `/admin/users/${uid}/sketches/create`,
   beginnerForm: (uid: string, id: number) => `/admin/users/${uid}/beginnerForms/${id}`,
   clientForm: (uid: string, id: number) => `/admin/users/${uid}/clientForms/${id}`,
   clientFormCreate: (uid: string) => `/admin/users/${uid}/clientForms/create`,

   userSketches: '/profile/sketches',
   userSketch: (id: number) => `/profile/sketches/${id}`,
   userForms: '/profile/forms',
   userFormCreate: '/profile/forms/create',
   userBeginnerForm: (id: number) => `/profile/forms/${id}`,
   userBriefs: '/profile/briefs',
   userClientForm: (id: number) => `/profile/briefs/${id}`,

   // Footer Gallery
   adminFooterGallery: '/admin/footerGallery',


   /**
   * Api
   */

   // Users
   getUsers: '/api/admin/users' as '/api/admin/users',
   updateUser: (id: string | number) => `/api/admin/users/${id}` as `/api/admin/users/${string | number}`,

   // Sketches
   getSketches: (uid: string) => `/api/users/${uid}/sketches` as `/api/users/${string}/sketches`,
   getSketch: (uid: string, id: number) => `/api/users/${uid}/sketches/${id}` as `/api/users/${string}/sketches/${number}`,
   createSketch: (uid: string) => `/api/users/${uid}/sketches/create` as `/api/users/${string}/sketches/create`,

   // Forms
   getBeginnerForms: (uid: string) => `/api/users/${uid}/beginnerForms` as `/api/users/${string}/beginnerForms`,
   getBeginnerForm: (uid: string, id: number) => `/api/users/${uid}/beginnerForms/${id}` as `/api/users/${string}/beginnerForms/${number}`,
   createBeginnerForm: (uid: string) => `/api/users/${uid}/beginnerForms/create` as `/api/users/${string}/beginnerForms/create`,
   getClientForms: (uid: string) => `/api/users/${uid}/clientForms` as `/api/users/${string}/clientForms`,
   getClientForm: (uid: string, id: number) => `/api/users/${uid}/clientForms/${id}` as `/api/users/${string}/clientForms/${number}`,
   createClientForm: (uid: string) => `/api/users/${uid}/clientForms/create` as `/api/users/${string}/clientForms/create`,

   // Media
   imagesList: '/api/media/images/' as '/api/media/images/',
   uploadImage: '/api/media/images/' as '/api/media/images/',
   getFile: (file: string) => `${useRequestURL().origin}/api/media/${file}` as `/api/media/images/${string}`,

   // Porfolio
   getPortfolio: '/api/portfolio' as '/api/portfolio',
   getSinglePortfolio: (slug: string) => `/api/portfolio/${slug}` as `/api/portfolio/${string}`,
   createPortfolio: '/api/admin/portfolio/create' as '/api/admin/portfolio/create',
   editPortfolio: (slug: string): `/api/admin/portfolio/${string}` => `/api/admin/portfolio/${slug}` as `/api/admin/portfolio/${string}`,
   deletePortfolio: (slug: string) => `/api/admin/portfolio/${slug}` as `/api/admin/portfolio/${string}`,
   portfolioFavourites: {
      list: '/api/portfolio/favourites' as '/api/portfolio/favourites',
      single: (id: number) => `/api/portfolio/favourites/${id}` as `/api/portfolio/favourites/${number}`
   },


   // Footer Gallery
   getFooterGallery: '/api/footerGallery' as '/api/footerGallery',
   editFooterGallery: '/api/admin/footerGallery/edit' as '/api/admin/footerGallery/edit',
}