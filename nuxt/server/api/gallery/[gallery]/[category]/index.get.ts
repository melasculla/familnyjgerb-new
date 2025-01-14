export default defineEventHandler({
   onRequest: [
      GalleryHandler.validateGallery,
      GalleryHandler.validateCategory,
   ],
   handler: async event => {
      const gallery = await new GalleryService().getGalleryByName(event.context.requestDTO.gallery)

      const category = await new GalleryCategoryService().getCategoryByName(
         event.context.requestDTO.category,
         gallery.id!
      )

      return await new GalleryItemService().getItems(category.id!)
   }
})