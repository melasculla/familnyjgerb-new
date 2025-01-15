export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess,
      GalleryHandler.validateIds
   ],
   handler: async event => {
      return await new GalleryItemService().deleteItems(event.context.requestDTO.ids)
   }
})