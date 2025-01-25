export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess,
      CategoryHandler.validateBody
   ],
   handler: async event => {
      return { category: event.context.requestDTO.body }
   }
})