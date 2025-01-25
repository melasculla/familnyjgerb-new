import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { z } from 'zod'

const CategoryBodySchema = z.object({
   slug: z.string().min(3, 'Slug must be at least 3 characters long'),
   nameRu: z.string().min(5, 'category must be at least 5 characters long'),
   nameEn: z.string().optional().nullable(),
}).strict()

const CategoryPatchBodySchema = CategoryBodySchema.partial().extend({
   id: z.number().int(),
}).strict()

const IDSchema = z.object({
   id: z.number().int(),
}).strict()

export class CategoryHandler {
   public static async validateBody(event: H3Event<EventHandlerRequest>, isPatch?: boolean) {
      const body = await useSafeValidatedBody(event, isPatch ? CategoryPatchBodySchema : CategoryBodySchema)
      if (!body.data || body.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(body.error.message)[0].message,
            data: body.error
         })

      event.context.requestDTO.body = body.data
   }

   public static async validateId(event: H3Event<EventHandlerRequest>) {
      const body = await useSafeValidatedBody(event, IDSchema)
      if (!body.data || body.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(body.error.message)[0].message,
            data: body.error
         })

      event.context.requestDTO.id = body.data.id
   }
}