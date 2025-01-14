export default defineEventHandler({
   onRequest: [
      GalleryHandler.validateGallery,
   ],
   handler: async event => {
      const gallery = await new GalleryService().getGalleryByName(event.context.requestDTO.gallery)
      return await new GalleryCategoryService().getAll(gallery.id!)
   }
})