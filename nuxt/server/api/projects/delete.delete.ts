export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess,
      event => ProjectHandler.validateBody(event, true),
   ],
   handler: async event => {
      try {
         await new ProjectService().deleteProject(event.context.requestDTO.body.id)
      } catch (err: any) {
         if (err.message.includes('projects_lang_group_projects_id_fk'))
            err.message = 'Cannot delete original project translation'

         throw createError({ statusCode: err.status, message: err.message, statusMessage: err.message })
      }
   }
})