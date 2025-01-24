export default defineEventHandler({
   onRequest: [
      event => LocaleHandler.validateLocale(event, true),
      PostHandler.validateBody,
      // AdminAuthHandler.checkAccess
   ],
   handler: async event => {
      const postService = new PostService()
      const body = event.context.requestDTO.body as Omit<NewPost, 'langId' | 'langGroup' | 'categoryId'>

      // const category = await new CategoryService().getCategoryBy('slug', event.context.requestDTO.category)
      // const categoryId = category.id

      try {
         const post = await postService.upsertPost({
            ...body,
            langId: event.context.requestDTO.langId
         })
         return { post }
      } catch (err: any) {
         if (err.message.includes('duplicate'))
            throw createError({ statusCode: 409, message: `Post with this slug and lang already exists` })

         throw createError({ statusCode: err.status, message: err.message })
      }
   }
})