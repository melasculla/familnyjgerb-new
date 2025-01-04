export default defineEventHandler({
   onRequest: [
      PostHandler.validateSlug,
      event => LocaleHandler.validateLocale(event, true),
   ],
   handler: async event => {
      const postService = new PostService()

      const post = await postService.getPostBy('slug', event.context.requestDTO.slug, event.context.requestDTO.langId)
      return { post }
   }
})