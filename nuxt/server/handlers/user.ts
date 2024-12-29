import { type H3Event, type EventHandlerRequest } from 'h3'

export class UserHanlder {
   public static validateId(event: H3Event<EventHandlerRequest>) {
      const id = getRouterParam(event, 'id')
      if (!id || !parseInt(id))
         throw createError(errorsList.badRequest)
   }

   public static async validateBody(event: H3Event<EventHandlerRequest>) {
      const { id: _id, ...body } = await readBody<NewUser>(event)
      if (!('name' in body && 'email' in body && 'uid' in body))
         throw createError(errorsList.badRequest)

      const isRoleExist = rolesList.includes(body.role || 'user')
      if (!isRoleExist)
         throw createError(errorsList.badRequest)

      event.context.requestDTO.body = body
   }
}