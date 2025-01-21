import { BodySchema } from "~~/server/handlers/media"

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
         await MediaHandler.validateOptions(event)

         const mediaService = new MediaService(event.context.requestDTO.storageKey)

         if (files && !event.context.requestDTO.filename && event.context.requestDTO.storageKey !== 'index') {
            MediaHandler.validateTypes(event)

            if (event.context.requestDTO.options.chunks) {
               await MediaHandler.validateBody(event)
               return await mediaService.createChunk(
                  files[0], // TODO: add multifiles support
                  event.context.requestDTO.body.filename,
                  event.context.requestDTO.body.index,
                  event.context.requestDTO.acceptedTypes
               )
            }

            return await mediaService.create(files, event.context.requestDTO.acceptedTypes)
         }

         if (event.context.requestDTO.options.chunks && event.context.requestDTO.options.final) {
            const body = BodySchema.safeParse(await readBody(event))
            if (body.error)
               throw createError({
                  statusCode: 400,
                  message: JSON.parse(body.error.message)[0].message,
                  data: body.error
               })

            return await mediaService.finalizeChunk(body.data.filename)
         }

         throw createError(errorsList.badRequest)
      }
   }
})