import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { z } from 'zod'

const ServicesFormSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters long'),
   email: z.string().email('Invalid email format'),
   services: z.object({
      dev: z.boolean(),
      logoDesign: z.boolean(),
      gerbs: z.boolean(),
      monograms: z.boolean(),
   }),
})

const FavouritesFormSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters long'),
   phone: z.string().regex(/^\+?[0-9\s]+$/, 'Invalid phone number format'),
   phoneCountry: z.string().length(2, 'Phone country must be 2 characters long'),
   email: z.string().email('Invalid email format'),
   message: z.string().optional(),
   favourites: z.array(
      z.object({
         title: z.string().min(1, 'Title cannot be empty'),
         link: z.string().min(1, 'Link cannot be empty'),
      })
   ).min(1, 'Favourites must contain at least one item').optional(),
})

const CombinedFormSchema = z.union([ServicesFormSchema, FavouritesFormSchema])

export type BaseEmailFormType = z.infer<typeof CombinedFormSchema>

export class NotificationHandler {
   public static async validateBody(event: H3Event<EventHandlerRequest>) {
      const body = await useSafeValidatedBody(event, CombinedFormSchema)

      if (!body.data || body.error)
         throw createError({ ...errorsList.badRequest, data: body.error })

      if ('favourites' in body.data) {
         body.data.favourites = body.data.favourites?.map(item => ({
            title: item.title,
            link: new URL(`/portfolio/${item.link}`, getRequestURL(event).origin).toString()
         }))
      }

      event.context.requestDTO.body = body.data
   }
}

// TODO: make counter for spam protection