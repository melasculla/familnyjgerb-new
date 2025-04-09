export default defineEventHandler({
   onRequest: [
      AdminAuthHandler.checkAccess,
      CategoryHandler.validateId
   ],
   handler: async event => {
      try {
         return await new CategoryService().deleteCategory('id', event.context.requestDTO.id)
      } catch (err: any) {
         let statusCode = err.status
         let message = err.message

         if (err.message.includes('on table "categories" violates foreign key constraint "posts_category_id_categories_id_fk"')) {
            statusCode = 400
            message = 'Cannot delete category with posts'
         }

         throw createError({ statusCode, message })
      }
   }
})