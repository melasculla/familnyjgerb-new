export default defineEventHandler({
   onRequest: [
      LocaleHandler.validateLocale,
      PostHandler.validateCategory,
      PostHandler.validateStatuses,
      PaginationHandler.validatePagination,
      SearchHandler.validateSearchRequest,
      PostHandler.validateOptions
   ],
   handler: async event => {
      const postService = new PostService()

      const [posts, total] = await Promise.all([
         postService.getPosts(
            event.context.requestDTO.locale,
            event.context.requestDTO.category,
            event.context.requestDTO.searchParam,
            event.context.requestDTO.pagination,
            event.context.requestDTO.options.planned,
            event.context.requestDTO.stasuses
         ),
         postService.getTotalPosts(
            event.context.requestDTO.locale,
            event.context.requestDTO.category,
            event.context.requestDTO.searchParam,
            event.context.requestDTO.options.planned,
            event.context.requestDTO.stasuses
         ),
      ])

      if (posts.length)
         return { total, posts }

      let errorMessage = []
      if (event.context.requestDTO.category)
         errorMessage.push(`for category "${event.context.requestDTO.category}"`)
      if (event.context.requestDTO.searchParam)
         errorMessage.push(`for request "${event.context.requestDTO.searchParam}"`)
      if (event.context.requestDTO.stasuses)
         errorMessage.push(`for statuses "${event.context.requestDTO.stasuses}"`)

      if (event.context.requestDTO.pagination && event.context.requestDTO.pagination.page !== 1)
         errorMessage.push(`on page "${event.context.requestDTO.pagination.page}"`)

      const message = 'Posts ' + (errorMessage.length <= 1 ? errorMessage.join('') : errorMessage.join(' and ')) + ' Not Found'

      throw createError({ statusCode: 404, statusMessage: message, message: message })
   }
})