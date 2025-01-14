export default defineEventHandler({
   onRequest: [],
   handler: async event => {
      return await new GalleryService().getGalleries()
   }
})