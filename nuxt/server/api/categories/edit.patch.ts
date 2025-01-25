export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess,
      event => CategoryHandler.validateBody(event, true)
   ],
   handler: async event => {
      return { category: event.context.requestDTO.body }
   }
})