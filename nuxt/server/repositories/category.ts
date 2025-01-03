import { eq } from "drizzle-orm";

export interface ICategoryRepository {
   findAll(): Promise<Category[]>

   findBy(by: 'id' | 'slug', idOrSlug: string | number): Promise<CategoryEntity | null>

   save(categoryEntity: CategoryEntity): Promise<CategoryEntity>

   removeBy(by: 'id' | 'slug', idOrSlug: string | number): Promise<void>
}

export class CategoryRepository implements ICategoryRepository {
   async findAll() {
      return await db.query.categoriesTable.findMany()
   }

   async findBy(by: 'id' | 'slug', idOrSlug: string | number) {
      const result = await db.query.categoriesTable.findFirst({
         where: eq(categoriesTable[by], idOrSlug)
      })
      if (!result)
         return null

      return new CategoryEntity(result)
   }

   async save(categoryEntity: CategoryEntity) {
      if (categoryEntity.id) {
         await db.update(categoriesTable).set({
            slug: categoryEntity.slug,
            nameEn: categoryEntity.nameEn,
            nameRu: categoryEntity.nameRu,
         }).where(eq(categoriesTable.id, categoryEntity.id))
      } else {
         const [inserted] = await db.insert(categoriesTable).values({
            slug: categoryEntity.slug,
            nameEn: categoryEntity.nameEn,
            nameRu: categoryEntity.nameRu,
         }).returning({ id: categoriesTable.id })

         categoryEntity.id = inserted.id
      }

      return categoryEntity
   }

   async removeBy(by: 'id' | 'slug', idOrSlug: string | number) {
      await db.delete(categoriesTable).where(eq(categoriesTable[by], idOrSlug))
   }
}