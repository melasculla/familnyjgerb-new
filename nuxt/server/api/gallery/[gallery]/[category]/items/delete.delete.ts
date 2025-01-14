export default defineEventHandler({
   onRequest: [
      // GalleryHandler.validateBody
   ],
   handler: async event => {
      // TODO make gallery category handler
      return await new GalleryItemService().deleteItems(event.context.requestDTO.body)
   }
})