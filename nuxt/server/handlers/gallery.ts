import { type H3Event, type EventHandlerRequest } from 'h3'
import { z, useSafeValidatedBody, useSafeValidatedParams, useSafeValidatedQuery } from 'h3-zod'

const GalleryItemsSchema = z.object({
   items: z.array(
      z.object({
         id: z.number().optional(),
         image: z.string().min(3, 'Image path must be at least 3 characters long'),
         title: z.string().optional().nullable(),
         altEn: z.string().optional().nullable(),
         altRu: z.string().optional().nullable(),
         order: z.number(),

         projectRu: z.number().optional().nullable(),
         projectEn: z.number().optional().nullable(),
         type: z.array(
            z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.type) as [string]))
         ).optional().nullable(),
         usage: z.array(
            z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.usage) as [string]))
         ).optional().nullable(),
         info: z.array(
            z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.info) as [string]))
         ).optional().nullable(),
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


const proccessMaybeArray = (val?: string | number | null | (string | number | null)[]) => {
   const arr = Array.isArray(val) ? val : [val]
   return arr.filter(item => item != undefined)
}
const GalleryMainFiltersSchema = z.object({
   gallery: z.enum(['gerbs', 'monograms']),
   category: z.array(z.enum(['standard', 'premium', 'elite', 'individual'])).or(z.enum(['standard', 'premium', 'elite', 'individual']))
      .optional().nullable().transform(proccessMaybeArray),

   type: z.array(
      z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.type) as [string]))
   ).or(
      z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.type) as [string]))
   ).optional().nullable().transform(val => proccessMaybeArray(val).map(item => Number(item))),
   usage: z.array(
      z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.usage) as [string]))
   ).or(
      z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.usage) as [string]))
   ).optional().nullable().transform(val => proccessMaybeArray(val).map(item => Number(item))),
   info: z.array(
      z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.info) as [string]))
   ).or(
      z.preprocess(val => typeof val === 'number' ? String(val) : val, z.enum(Object.keys(GALLERY_ENUM.info) as [string]))
   ).optional().nullable().transform(val => proccessMaybeArray(val).map(item => Number(item))),
})

export type GalleryMainFiltersRequest = z.infer<typeof GalleryMainFiltersSchema>

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

   public static async validateFilters(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedQuery(event, GalleryMainFiltersSchema)
      if (!query.data || query.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(query.error.message)[0].message,
            data: query.error
         })

      event.context.requestDTO.filters = query.data
   }
}