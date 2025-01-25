export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess,
      CategoryHandler.validateId
   ],
   handler: async event => {
      return { id: event.context.requestDTO.id }
   }
})