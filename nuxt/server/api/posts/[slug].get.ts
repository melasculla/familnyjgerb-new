export default defineEventHandler({
   onRequest: [
      PostHandler.validateSlug,
      event => LocaleHandler.validateLocale(event, true),
   ],
   handler: async event => {
      const post = await new PostService().getPostBy('slug', event.context.requestDTO.slug, event.context.requestDTO.langId)
      const category = post.categoryId ? await new CategoryService().getCategoryBy('id', post.categoryId) : undefined

      return {
         post,
         category
      }
   }
})