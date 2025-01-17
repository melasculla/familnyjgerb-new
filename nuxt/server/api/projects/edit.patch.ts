export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess
      event => LocaleHandler.validateLocale(event, true),
      event => ProjectHandler.validateBody(event, true),
   ],
   handler: async event => {
      return await new ProjectService().upsertProject({
         ...event.context.requestDTO.body,
         langId: event.context.requestDTO.langId
      })
   }
})