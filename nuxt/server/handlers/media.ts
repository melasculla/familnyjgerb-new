import { type H3Event, type EventHandlerRequest } from 'h3'

export class MediaHandler {
   public static validatePath(event: H3Event<EventHandlerRequest>) {
      const regex = /^(.*?)(?:\/([^\/]+))?\/?$/

      const match = event.context.params!.path.match(regex)
      if (!match)
         throw createError(errorsList.badRequest)

      const directoryPath = match[1]
      const lastSegment = match[2]

      if (lastSegment && /\.[a-zA-Z0-9]+$/.test(lastSegment)) {
         event.context.requestDTO.storageKey = directoryPath.replaceAll('/', ':')
         event.context.requestDTO.filename = lastSegment
      } else {
         const fullPath = event.context.params!.path.replace(/\/$/, '')
         event.context.requestDTO.storageKey = fullPath.replaceAll('/', ':')
         event.context.requestDTO.filename = null
      }
   }

   public static validateTypes(event: H3Event<EventHandlerRequest>) {
      const { types } = getQuery(event) as { types: string | string[] }
      if (!types || !types.length)
         return

      const acceptedTypes: string[] = []

      const regex = /^[a-zA-Z0-9-]+\/([a-zA-Z0-9-]+)?$/
      if (Array.isArray(types)) {
         for (const type of types) {
            if (!regex.test(type))
               throw createError(errorsList.badRequest)

            acceptedTypes.push(type)
         }
      } else {
         if (!regex.test(types))
            throw createError(errorsList.badRequest)

         acceptedTypes.push(types)
      }

      event.context.requestDTO.acceptedTypes = acceptedTypes.length ? acceptedTypes : undefined
   }
}