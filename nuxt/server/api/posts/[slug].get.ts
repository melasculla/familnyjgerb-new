export default defineEventHandler({
   onRequest: [
      PostHandler.validateSlug,
      event => LocaleHandler.validateLocale(event, true),
   ],
   handler: async event => {
      try {
         const postService = new PostService()

         const post = await postService.getPostBy('slug', event.context.requestDTO.slug, event.context.requestDTO.langId)

         if (post.plannedAt && post.plannedAt > new Date())
            AdminAuthHandler.checkAccess(event)

         const category = post.categoryId
            ? await new CategoryService().getCategoryBy('id', post.categoryId).catch(() => { })
            : undefined
         const adjacents = await postService.getAdjacents(post.createdAt!, event.context.requestDTO.langId).catch(() => { })

         return {
            post,
            category,
            ...adjacents
         }
      } catch (err: any) {
         throw createError({ statusCode: err.statusCode || err.code, statusMessage: err.message, message: err.message })
      }
   }
})