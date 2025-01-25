export interface ICategoryService {
   getCategories(): Promise<Category[]>

   getCategoryBy(by: 'id' | 'slug', idOrSlug: string | number): Promise<CategoryEntity>

   upsertCategory(categoryObject: NewCategory): Promise<CategoryEntity>

   deleteCategory(by: 'id' | 'slug', idOrSlug: string | number): Promise<void>
}

export class CategoryService implements ICategoryService {
   private repository: ICategoryRepository

   constructor() {
      this.repository = new CategoryRepository()
   }

   async getCategories() { // TODO: add posts count
      return await this.repository.findAll()
   }

   async getCategoryBy(by: 'id' | 'slug', idOrSlug: string | number) {
      const category = await this.repository.findBy(by, idOrSlug)
      if (!category)
         throw createError(errorsList.notFound('Category'))

      return category
   }

   async upsertCategory(categoryObject: NewCategory) {
      const categoryEntity = new CategoryEntity(categoryObject)
      return await this.repository.save(categoryEntity)
   }

   async deleteCategory(by: 'id' | 'slug', idOrSlug: string | number) {
      await this.repository.removeBy(by, idOrSlug)
   }
}