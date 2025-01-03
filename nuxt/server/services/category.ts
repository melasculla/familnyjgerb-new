export interface ICategoryService {
   getCategories(): Promise<Category[]>

   getCategoryBy(by: 'id' | 'slug', idOrSlug: string | number): Promise<CategoryEntity>

   // TODO: add upsert and delete
}

export class CategoryService implements ICategoryService {
   private repository: ICategoryRepository

   constructor() {
      this.repository = new CategoryRepository()
   }

   async getCategories() {
      return await this.repository.findAll()
   }

   async getCategoryBy(by: 'id' | 'slug', idOrSlug: string | number) {
      const category = await this.repository.findBy(by, idOrSlug)
      if (!category)
         throw createError(errorsList.notFound('Category'))

      return category
   }
}