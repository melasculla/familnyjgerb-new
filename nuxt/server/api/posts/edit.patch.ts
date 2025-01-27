export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess
      event => LocaleHandler.validateLocale(event, true),
      event => PostHandler.validateBody(event, true),
   ],
   handler: async event => {
      try {
         const post = await new PostService().upsertPost({
            ...event.context.requestDTO.body,
            langId: event.context.requestDTO.langId
         })

         setResponseStatus(event, 201)
         return { post }
      } catch (err: any) {
         let message = err.message;
         let code = err.status;
         if (err.message.includes('slug_unique')) {
            code = 409
            message = 'Slug is taken'
         }

         throw createError({ statusCode: code, message: message })
      }
   }
})