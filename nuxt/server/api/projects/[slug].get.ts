export default defineEventHandler({
   onRequest: [
      ProjectHandler.validateSlug,
      event => LocaleHandler.validateLocale(event, true),
   ],
   handler: async event => {
      const projectService = new ProjectService()

      const project = await projectService.getProjectBy('slug', event.context.requestDTO.slug, event.context.requestDTO.langId)
      const adjacents = await projectService.getAdjacents(project.id!, event.context.requestDTO.langId).catch(() => { })

      return {
         project,
         ...adjacents
      }
   }
})