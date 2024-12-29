import { type H3Event, type EventHandlerRequest } from 'h3'
import { useSafeValidatedBody } from 'h3-zod'
import { z } from 'zod'

const BaseFormSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters long'),
   phone: z.string().regex(/^\+?[0-9\s]+$/, 'Invalid phone number format'),
   phoneCountry: z.string().length(2, 'Phone country must be 2 characters long'),
   email: z.string().email('Invalid email format'),
   message: z.string().optional(),
   // services: z.object({
   //    dev: z.boolean(),
   //    logoDesign: z.boolean(),
   //    gerbs: z.boolean(),
   //    monograms: z.boolean(),
   // }),
})

// const CombinedFormSchema = z.union([ServicesFormSchema, FavouritesFormSchema])

export type BaseEmailFormType = z.infer<typeof BaseFormSchema>

export class NotificationHandler {
   public static async validateBody(event: H3Event<EventHandlerRequest>) {
      const body = await useSafeValidatedBody(event, BaseFormSchema)
      if (!body.data || body.error)
         throw createError({ ...errorsList.badRequest, data: body.error })

      event.context.requestDTO.body = body.data
   }
}

// TODO: make counter for spam protection