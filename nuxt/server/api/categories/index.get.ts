export default defineEventHandler({
   onRequest: [],
   handler: async event => {
      const categories = await new CategoryService().getCategories()
      return categories
   }
})