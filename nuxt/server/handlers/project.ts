import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedQuery, useSafeValidatedBody, useSafeValidatedParams } from 'h3-zod'
import { z } from 'zod'

const SlugSchema = z.object({
   slug: z.string().min(3, 'Slug must be at least 3 characters long'),
})

const StatusSchema = z.object({
   statuses: z.array(z.string().min(3, 'Status must be at least 3 characters long').toLowerCase()).optional()
      .or(z.string().min(3, 'Status must be at least 3 characters long').toLowerCase().optional()),
})

const ImageJSONSchema = z.object({
   path: z.string(),
   alt: z.string().optional(),
})

const ProjectSchema = z.object({
   slug: z.string().min(4).max(256, 'Slug must be at least 5 characters long')
      .refine(slug => !['list', 'monograms', 'gerbs', 'create',].includes(slug), { message: 'This slug is restricted and cannot be used.' })
      .refine(slug => !slug.includes('__'), { message: 'Slug cannot contain "__".' }),
   title: z.string().min(4).max(256, 'Title must be at least 5 characters long'),
   description: z.string().min(15, 'Description must be at least 15 characters long').nullable().optional(),
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
   usage: z.array(ImageJSONSchema).nullable().optional(),
   sketches: z.array(ImageJSONSchema).nullable().optional(),
   thumbnail: ImageJSONSchema.nullable().optional(),
   video: z.string().min(5, 'Video path must be at least 5 characters long').nullable().optional(),
   status: z.enum(projectsStatusList).optional(),
   createdAt: z.string().datetime({ offset: true }).optional(), // ISO string
   seoKeys: z.string().nullable().optional(),
   ogImage: z.string().min(5, 'OGImage path must be at least 5 characters long').nullable().optional(),
}).strict()

const PatchProjectSchema = ProjectSchema.partial().extend({
   id: z.number().int(),
})

const OptionsSchema = z.object({
   options: z.preprocess(val => {
      if (typeof val === 'string')
         try { return JSON.parse(val) } catch { return undefined }

      return val
   }, z.object({
      random: z.boolean().default(false),
      exclude: z.array(z.number()).optional()
   })).optional()
})

export class ProjectHandler {
   public static async validateBody(event: H3Event<EventHandlerRequest>, isPatch: boolean = false) {
      const body = await useSafeValidatedBody(event, isPatch ? PatchProjectSchema : ProjectSchema)
      if (!body.data || body.error)
         throw createError({
            statusCode: 400,
            message: JSON.parse(body.error.message)[0].message,
            data: body.error
         })

      event.context.requestDTO.body = body.data
   }

   public static async validateSlug(event: H3Event<EventHandlerRequest>) {
      const params = await useSafeValidatedParams(event, SlugSchema)
      if (!params.data || params.error) {
         const error = JSON.parse(params.error.message)[0]
         throw createError({
            statusCode: 400,
            message: `${error.message}`,
            data: params.error
         })
      }

      event.context.requestDTO.slug = params.data.slug
   }

   public static async validateStatuses(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedQuery(event, StatusSchema)
      if (!query.data || query.error) {
         const error = JSON.parse(query.error.message)[0]
         throw createError({
            statusCode: 400,
            message: `${error.message}`,
            data: query.error
         })
      }

      if (!query.data.statuses)
         return

      const statuses = typeof query.data.statuses === 'string' ? [query.data.statuses] : query.data.statuses
      const validStatuses = statuses.filter(item => projectsStatusList.includes(item as any))
      if (!validStatuses.length) {
         throw createError({ statusCode: 400, message: `Statuses ${statuses.filter(item => !projectsStatusList.includes(item as any)).join(' and ')} not found` })
      }

      // if (validStatuses.includes('hidden') || validStatuses.includes('deleted'))
      //    AdminAuthHandler.checkAccess(event)

      event.context.requestDTO.stasuses = validStatuses
   }

   public static async validateOptions(event: H3Event<EventHandlerRequest>) {
      const query = await useSafeValidatedQuery(event, OptionsSchema)
      if (!query.data || query.error) {
         const error = JSON.parse(query.error.message)[0]
         throw createError({
            statusCode: 400,
            message: `${error.message}`,
            data: query.error
         })
      }

      event.context.requestDTO.options = query.data.options || {}
   }
}