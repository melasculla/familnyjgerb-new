export default defineEventHandler({
   onRequest: [
      // AdminAuthHandler.checkAccess,
      CategoryHandler.validateBody
   ],
   handler: async event => {
      try {
         return { category: await new CategoryService().upsertCategory(event.context.requestDTO.body) }
      } catch (err: any) {
         let statusCode = err.status
         let message = err.message

         // if (err.message.includes('on table "categories" violates foreign key constraint "posts_category_id_categories_id_fk"')) {
         //    statusCode = 400
         //    message = 'Cannot delete category with posts'
         // }

         throw createError({ statusCode, message })
      }
   }
})