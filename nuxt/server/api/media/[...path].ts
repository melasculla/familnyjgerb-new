export default defineEventHandler({
   onRequest: [
      MediaHandler.validatePath,
      PaginationHandler.validatePagination
   ],
   handler: async event => {
      assertMethod(event, ['GET', 'POST'])


      if (event.method === 'GET') {
         if (event.context.requestDTO.filename) {
            const { data, meta } = await new MediaService(event.context.requestDTO.storageKey).getByKey(event.context.requestDTO.filename)
            setHeader(event, 'content-type', meta.mime)
            return data
         }

         SearchHandler.validateSearchRequest(event)

         return await new MediaService(event.context.requestDTO.storageKey).getAll(
            event.context.requestDTO.pagination,
            event.context.requestDTO.searchParam
         )
      }


      else if (event.method === 'POST') {
         const files = await readMultipartFormData(event)
         if (!files || event.context.requestDTO.filename)
            throw createError(errorsList.badRequest)

         MediaHandler.validateTypes(event)

         return await new MediaService(event.context.requestDTO.storageKey).create(files, event.context.requestDTO.acceptedTypes)
      }
   }
})