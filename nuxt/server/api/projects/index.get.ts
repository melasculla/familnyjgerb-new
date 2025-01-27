export default defineEventHandler({
   onRequest: [
      LocaleHandler.validateLocale,
      ProjectHandler.validateStatuses,
      PaginationHandler.validatePagination,
      SearchHandler.validateSearchRequest,
   ],
   handler: async event => {
      const projectService = new ProjectService()

      const [projects, total] = await Promise.all([
         projectService.getProjects(
            event.context.requestDTO.locale,
            event.context.requestDTO.searchParam,
            event.context.requestDTO.pagination,
            event.context.requestDTO.stasuses
         ),
         projectService.getTotalProjects(
            event.context.requestDTO.locale,
            event.context.requestDTO.searchParam,
            event.context.requestDTO.stasuses
         ),
      ])

      if (projects.length)
         return { total, projects }

      let errorMessage = []
      if (event.context.requestDTO.searchParam)
         errorMessage.push(`for request "${event.context.requestDTO.searchParam}"`)
      if (event.context.requestDTO.stasuses)
         errorMessage.push(`for statuses "${event.context.requestDTO.stasuses}"`)
      if (event.context.requestDTO.pagination && event.context.requestDTO.pagination.page !== 1)
         errorMessage.push(`on page "${event.context.requestDTO.pagination.page}"`)

      const message = 'Projects ' + (errorMessage.length <= 1 ? errorMessage.join('') : errorMessage.join(' and ')) + ' Not Found'

      throw createError({ statusCode: 404, statusMessage: message, message: message })
   }
})