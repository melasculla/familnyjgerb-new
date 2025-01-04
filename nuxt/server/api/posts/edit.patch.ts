export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess
      event => LocaleHandler.validateLocale(event, true),
      event => PostHandler.validateBody(event, true),
   ],
   handler: async event => {
      return await new PostService().upsertPost({
         ...event.context.requestDTO.body,
         langId: event.context.requestDTO.langId
      })
   }
})