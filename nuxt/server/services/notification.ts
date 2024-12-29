import { type Transporter } from "nodemailer"
import { EmailNotificationDTO } from "../utils/interfaces"

export interface EventListener {
   update(): void
}

/**
 * ### Example Usage
 * 
 * ```typescript
 * const eventTypes = ['sketch:created', 'sketch:updated'] as const;
 * 
 * class SomeClass {
 *    private notificationService: NotificationService<typeof eventTypes[number]>;
 * }
 * ```
 * 
 * - **`eventTypes`**: An array of event types, defined as `const`.
 * - **`NotificationService`**: A generic service that accepts `eventTypes` as its type.
 */
export class NotificationService<EventTypes extends string> {
   private customers: Record<EventTypes, EventListener[]>

   constructor(eventTypes: EventTypes[]) {
      this.customers = eventTypes.reduce((total, eventType) => {
         total[eventType] = []
         return total
      }, {} as Record<EventTypes, EventListener[]>)
   }

   subscribe(eventType: EventTypes, listener: EventListener): void {
      this.customers[eventType].push(listener);
   }

   unsubscribe(eventType: EventTypes, listener: EventListener): void {
      this.customers[eventType] = this.customers[eventType].filter(l => l !== listener)
   }

   notify(eventType: EventTypes): void {
      this.customers[eventType].forEach(listener => listener.update())
   }
}

export class EmailMessageListener implements EventListener {
   private transporter: Transporter
   private DTO: EmailNotificationDTO

   constructor(DTO: EmailNotificationDTO) {
      this.transporter = useSMTPTransporter
      this.DTO = DTO
   }

   async update() {
      try {
         await this.transporter.sendMail({
            from: 'Art Studio «Traditions of Times» <info@art-studiott.com>',
            to: this.DTO.to,
            subject: this.DTO.subject,
            text: this.DTO.plainText,
            html: this.DTO.html,
            replyTo: this.DTO.from ? this.DTO.from : 'info@art-studiott.com',
         });
      } catch (err: any) {
         throw createError({ statusCode: err.code, message: err.message })
      }
   }
}