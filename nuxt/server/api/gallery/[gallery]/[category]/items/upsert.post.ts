export default defineEventHandler({
   onRequest: [
      GalleryHandler.validateBody,
      GalleryHandler.validateGallery,
      GalleryHandler.validateCategory,
   ],
   handler: async event => {
      const gallery = await new GalleryService().getGalleryByName(event.context.requestDTO.gallery)

      const category = await new GalleryCategoryService().getCategoryByName(
         event.context.requestDTO.category,
         gallery.id!
      )

      try {
         return await new GalleryItemService().upsertItems(category.id!, event.context.requestDTO.body)
      } catch (err: any) {
         if (err.message.includes('duplicate'))
            throw createError({ statusCode: 409, message: `Item with this order or source already exists` })

         throw createError({ statusCode: err.status, message: err.message })
      }
   }
})