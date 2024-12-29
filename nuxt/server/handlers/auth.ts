import { type H3Event, type EventHandlerRequest } from 'h3'

export class AuthHandler {
   public static isLoggedIn(event: H3Event<EventHandlerRequest>) {
      if (!event.context.uid)
         throw createError(errorsList.unauthorized)
   }

   public static isSameUser(event: H3Event<EventHandlerRequest>) {
      if (event.context.role === 'admin')
         return

      const uid = event.context.params?.uid
      const isTheSameUser = event.context.uid === uid
      if (!isTheSameUser)
         throw createError(errorsList.forbidden)
   }
}

export class ClientAuthHandler {
   public static checkAccess(event: H3Event<EventHandlerRequest>) {
      if (event.context.role !== 'client' && event.context.role !== 'admin')
         throw createError(errorsList.forbidden)
   }
}

export class AdminAuthHandler {
   public static checkAccess(event: H3Event<EventHandlerRequest>) {
      if (event.context.role !== 'admin')
         throw createError(errorsList.forbidden)
   }
}