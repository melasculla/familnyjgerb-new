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

            if (meta.mime)
               setHeader(event, 'content-type', meta.mime)

            return data
         }

         SearchHandler.validateSearchRequest(event)
         await MediaHandler.validateOptions(event)

         const storageKey = event.context.requestDTO.storageKey === 'index'
            ? null
            : event.context.requestDTO.storageKey

         const mediaService = new MediaService(storageKey)

         if (event.context.requestDTO.options.folders)
            return { data: await mediaService.getFolders() }

         return await mediaService.getAll(
            event.context.requestDTO.pagination,
            event.context.requestDTO.searchParam,
            event.context.requestDTO.options
         )
      }


      else if (event.method === 'POST') {
         const files = await readMultipartFormData(event)
         if (!files || event.context.requestDTO.filename || event.context.requestDTO.storageKey === 'index')
            throw createError(errorsList.badRequest)

         MediaHandler.validateTypes(event)

         return await new MediaService(event.context.requestDTO.storageKey).create(files, event.context.requestDTO.acceptedTypes)
      }
   }
})