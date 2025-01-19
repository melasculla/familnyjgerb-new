export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess
      event => LocaleHandler.validateLocale(event, true),
      event => ProjectHandler.validateBody(event, true),
   ],
   handler: async event => {
      try {
         const project = await new ProjectService().upsertProject({
            ...event.context.requestDTO.body,
            langId: event.context.requestDTO.langId
         })

         return { project }
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