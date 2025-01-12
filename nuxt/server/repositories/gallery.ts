import { GalleryItemEntity } from "#imports"
import { eq, not, and, count, or, ilike, lt, gt, isNull, inArray, desc } from "drizzle-orm";

export interface IGalleryItemRepository {
   findAllItems(galleryCategoryId: number): Promise<GalleryItem[]>

   save(galleryCategoryId: number, galleryItemEntities: GalleryItemEntity[]): Promise<GalleryItemEntity[]>

   remove(id: number): Promise<void>
}

export class GalleryItemRepository implements IGalleryItemRepository {
   async findAllItems(galleryCategoryId: number) {
      return db.query.galleryItemsTable.findMany({
         where: eq(galleryItemsTable.categoryId, galleryCategoryId),
         orderBy: (table, { desc }) => desc(table.order)
      })
   }

   async save(galleryCategoryId: number, galleryItemEntities: GalleryItemEntity[]) {
      const itemsToInsert = galleryItemEntities.filter(item => !item.id)
      const itemsToUpdate = galleryItemEntities.filter(item => item.id)

      if (itemsToInsert.length) {
         const insertedItems = await db.insert(galleryItemsTable)
            .values(itemsToInsert.map(item => ({
               ...item,
               id: undefined,
               categoryId: galleryCategoryId
            })))
            .returning()

         for (const item of insertedItems) {
            const index = galleryItemEntities.findIndex(insertedItem => insertedItem.image === item.image)
            galleryItemEntities[index] = Object.assign(item)
         }
      }

      if (itemsToUpdate) {
         await db.transaction(async tx => {
            for (const item of itemsToUpdate) {
               const [updated] = await tx.update(galleryItemsTable)
                  .set({
                     image: item.image,
                     title: item.title,
                     altRu: item.altRu,
                     altEn: item.altEn,
                     order: item.order,
                  })
                  .where(eq(galleryItemsTable.id, item.id!))
                  .returning()

               const index = galleryItemEntities.findIndex(item => item.id === updated.id)
               galleryItemEntities[index] = Object.assign(updated)

               if (!updated) {
                  tx.rollback()
                  throw createError(errorsList.notFound(`Item with ID: ${item.id}`))
               }
            }
         })
      }

      return galleryItemEntities
   }

   async remove(id: number) {
      await db.delete(galleryItemsTable).where(eq(galleryItemsTable.id, id))
   }
}