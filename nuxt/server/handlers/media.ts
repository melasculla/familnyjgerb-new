import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedQuery } from 'h3-zod'
import { z } from 'zod'

const OptionsSchema = z.object({
   options: z.preprocess(val => {
      if (typeof val === 'string')
         try { return JSON.parse(val) } catch { return undefined }

      return val
   }, z.object({
      depth: z.boolean().default(false),
      folders: z.boolean().default(false),
      chunks: z.boolean().default(false),
      final: z.boolean().default(false),
   })).optional(),
})

export const BodySchema = z.object({
   filename: z.string(),
   index: z.preprocess((val: any) => parseInt(val), z.number())
}).strict()

export class MediaHandler {
   public static validatePath(event: H3Event<EventHandlerRequest>) {
      const regex = /^(.*?)(?:\/([^\/]+))?\/?$/

      const match = event.context.params!.path.match(regex)
      if (!match)
         throw createError(errorsList.badRequest)

      const directoryPath = match[1]
      const lastSegment = match[2]

      // if (!/^[a-zA-Z0-9\/]*$/.test(event.context.params!.path))
      //    throw createError({ statusCode: 400, message: 'Invalid characters in path' })

      const regexFilename = /\.[a-zA-Z0-9]+$/
      const isRootFilename = regexFilename.test(directoryPath)
      if ((lastSegment && regexFilename.test(lastSegment)) || isRootFilename) {
         event.context.requestDTO.storageKey = isRootFilename ? null : directoryPath.replaceAll('/', ':')
         event.context.requestDTO.filename = isRootFilename ? directoryPath : lastSegment
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

   public static async validateOptions(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedQuery(event, OptionsSchema)
      if (query.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(query.error.message)[0].message,
            data: query.error
         })

      event.context.requestDTO.options = query.data.options || {}
   }

   public static async validateBody(event: H3Event<EventHandlerRequest>) {
      const plainObject: Record<string, any> = {}
      const rawBody = await readFormData(event)
      for (const [key, value] of rawBody.entries()) {
         if (value instanceof File)
            continue

         plainObject[key] = value
      }

      const body = BodySchema.safeParse(plainObject)
      if (body.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(body.error.message)[0].message,
            data: body.error
         })

      event.context.requestDTO.body = body.data
   }
}