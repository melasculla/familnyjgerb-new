import { FormMessageDTO } from "~~/server/utils/DTO/FormMessageDTO"

export default defineEventHandler({
   onRequest: [
      NotificationHandler.validateBody
   ],
   handler: async event => {
      await new EmailMessageListener(
         new FormMessageDTO(event.context.requestDTO.body)
      ).update()
   }
})