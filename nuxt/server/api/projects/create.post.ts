export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess
      event => LocaleHandler.validateLocale(event, true),
      ProjectHandler.validateBody,
   ],
   handler: async event => {
      const projectService = new ProjectService()
      const body = event.context.requestDTO.body as Omit<NewProject, 'langId' | 'langGroup'>

      try {
         const project = await projectService.upsertProject({
            ...body,
            langId: event.context.requestDTO.langId
         })

         setResponseStatus(event, 201)
         return { project }
      } catch (err: any) {
         if (err.message.includes('duplicate'))
            throw createError({ statusCode: 409, message: `Project with this slug and lang already exists` })

         throw createError({ statusCode: err.status, message: err.message })
      }
   }
})