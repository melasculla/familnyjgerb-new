import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedQuery, useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { z } from 'zod'

const GalleryItemsSchema = z.object({
   items: z.array(
      z.object({
         id: z.string().optional(),
         image: z.string().min(3, 'Image path must be at least 3 characters long'),
         title: z.string().optional(),
         altEn: z.string().optional(),
         altRu: z.string().optional(),
         order: z.number(),
      })
   ),
   category: z.string()
}).strict()

export class GalleryHandler {
   public static async validateBody(event: H3Event<EventHandlerRequest>) {
      const body = await useSafeValidatedBody(event, GalleryItemsSchema)
      if (!body.data || body.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(body.error.message)[0].message,
            data: body.error
         })

      event.context.requestDTO.body = body.data
   }
}