import { eq } from "drizzle-orm";

export interface ICategoryRepository {
   findAll(): Promise<Category[]>

   findBy(by: 'id' | 'slug', idOrSlug: string | number): Promise<CategoryEntity | null>

   save(categoryEntity: CategoryEntity): Promise<CategoryEntity>

   removeBy(by: 'id' | 'slug', idOrSlug: string | number): Promise<void>
}

export class CategoryRepository implements ICategoryRepository {
   async findAll() {
      return await db.query.categoriesTable.findMany({
         orderBy: (fields, { asc }) => asc(fields.id),
      })
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
         const [updated] = await db.update(categoriesTable).set({
            slug: categoryEntity.slug,
            nameEn: categoryEntity.nameEn,
            nameRu: categoryEntity.nameRu,
         }).where(eq(categoriesTable.id, categoryEntity.id)).returning()

         categoryEntity = Object.assign(updated)
      } else {
         const [inserted] = await db.insert(categoriesTable).values({
            slug: categoryEntity.slug,
            nameEn: categoryEntity.nameEn,
            nameRu: categoryEntity.nameRu,
         }).returning()

         categoryEntity = Object.assign(inserted)
      }

      return categoryEntity
   }

   async removeBy(by: 'id' | 'slug', idOrSlug: string | number) {
      await db.delete(categoriesTable).where(eq(categoriesTable[by], idOrSlug))
   }
}