export default defineEventHandler({
   onRequest: [
      PaginationHandler.validatePagination,
      GalleryHandler.validateFilters,
   ],
   handler: async event => {
      try {
         return await new GalleryItemService().getMainItems(event.context.requestDTO.filters, event.context.requestDTO.pagination)
      } catch (err: any) {
         throw createError({ statusCode: err.statusCode || err.code, message: err.message })
      }
   }
})