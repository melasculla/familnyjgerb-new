export default defineEventHandler({
   onRequest: [],
   handler: async event => {
      try {
         return await new GalleryService().getGalleries()
      } catch (err: any) {
         throw createError({ statusCode: err.statusCode || err.code, message: err.message })
      }
   }
})