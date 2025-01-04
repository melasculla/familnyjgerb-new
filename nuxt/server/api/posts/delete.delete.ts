export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess,
      event => PostHandler.validateBody(event, true),
   ],
   handler: async event => {
      try {
         await new PostService().deletePost(event.context.requestDTO.body.id)
      } catch (err: any) {
         if (err.message.includes('posts_lang_group_posts_id_fk'))
            err.message = 'Cannot delete original post translation'

         throw createError({ statusCode: err.status, message: err.message, statusMessage: err.message })
      }
   }
})