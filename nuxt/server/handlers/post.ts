import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedQuery, useSafeValidatedBody } from 'h3-zod'
import { z } from 'zod'

const CategorySchema = z.object({
   category: z.string().min(3, 'Category must be at least 3 characters long').optional(),
})

const ImageJSONSchema = z.object({
   path: z.string(),
   alt: z.string().optional(),
})

const PostSchema = z.object({
   slug: z.string().min(3).max(256),
   title: z.string().min(3).max(256),
   description: z.string().nullable().optional(),
   content: z.object({
      version: z.string().optional(),
      time: z.number().optional(),
      blocks: z.array(
         z.object({
            id: z.string().optional(),
            type: z.string(),
            data: z.record(z.any()),
            tunes: z.record(z.any()).optional(),
         })
      ),
   }).nullable().optional(),
   gallery: z.array(ImageJSONSchema).nullable().optional(),
   thumbnail: ImageJSONSchema.nullable().optional(),
   status: z.enum(postsStatusList).optional(),
   plannedAt: z.string().datetime({ offset: true }).nullable().optional(), // ISO string
   createdAt: z.string().datetime({ offset: true }).optional(), // ISO string
   seoKeys: z.string().nullable().optional(),
}).strict()

export class PostHandler {
   public static async validateBody(event: H3Event<EventHandlerRequest>) {
      const body = await useSafeValidatedBody(event, PostSchema)
      if (!body.data || body.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(body.error.message)[0].message,
            data: body.error
         })

      event.context.requestDTO.body = body.data
   }

   public static async validateCategory(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedQuery(event, CategorySchema)
      if (!query.data || query.error) {
         const error = JSON.parse(query.error.message)[0]
         console.log(error)
         throw createError({
            statusCode: 400,
            message: `${error.message}`,
            data: query.error
         })
      }

      event.context.requestDTO.category = query.data.category
   }
}