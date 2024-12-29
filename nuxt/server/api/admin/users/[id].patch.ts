export default defineEventHandler({
   onRequest: [
      UserHanlder.validateId,
      UserHanlder.validateBody
   ],
   handler: async event => {
      return await new UserService().upsertUser({ id: +event.context.params!.id, ...event.context.requestDTO.body })
   }
})