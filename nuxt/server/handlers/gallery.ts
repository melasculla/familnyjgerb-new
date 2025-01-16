import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { z } from 'zod'

const GalleryItemsSchema = z.object({
   items: z.array(
      z.object({
         id: z.number().optional(),
         image: z.string().min(3, 'Image path must be at least 3 characters long'),
         title: z.string().optional().nullable(),
         altEn: z.string().optional().nullable(),
         altRu: z.string().optional().nullable(),
         order: z.number(),
      }).strict()
   ),
}).strict()

const GalleryCategorySchema = z.object({
   category: z.string().min(3, 'Category must be at least 3 characters long').toLowerCase()
})

const GallerySchema = z.object({
   gallery: z.string().min(3, 'Gallery name must be at least 3 characters long').toLowerCase()
})

const IdsSchema = z.object({
   ids: z.array(z.number())
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

      event.context.requestDTO.body = body.data.items
   }

   public static async validateCategory(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedParams(event, GalleryCategorySchema)
      if (!query.data || query.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(query.error.message)[0].message,
            data: query.error
         })

      event.context.requestDTO.category = query.data.category
   }

   public static async validateGallery(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedParams(event, GallerySchema)
      if (!query.data || query.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(query.error.message)[0].message,
            data: query.error
         })

      event.context.requestDTO.gallery = query.data.gallery
   }

   public static async validateIds(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedBody(event, IdsSchema)
      if (!query.data || query.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(query.error.message)[0].message,
            data: query.error
         })

      event.context.requestDTO.ids = query.data.ids
   }
}