export default defineEventHandler({
   onRequest: [
      LocaleHandler.validateLocale,
      PostHandler.validateCategory,
      PaginationHandler.validatePagination,
      SearchHandler.validateSearchRequest,
   ],
   handler: async event => {
      const postService = new PostService()
      const [posts, total] = await Promise.all([
         await postService.getPosts(
            event.context.requestDTO.locale,
            event.context.requestDTO.category,
            event.context.requestDTO.searchParam,
            event.context.requestDTO.pagination,
            event.context.role === 'admin'
         ),
         await postService.getTotalPosts(
            event.context.requestDTO.locale,
            event.context.requestDTO.category,
            event.context.requestDTO.searchParam,
            event.context.role === 'admin'
         ),
      ])

      return {
         total,
         posts
      }
   }
})