import { CategoryEntity, GalleryCategoryEntity, GalleryItemEntity } from "#imports"
import { eq, inArray, and } from "drizzle-orm";

export interface IGalleryItemRepository {
   findAllItems(galleryCategoryId: number): Promise<GalleryItem[]>

   save(galleryCategoryId: number, galleryItemEntities: GalleryItemEntity[]): Promise<GalleryItemEntity[]>

   remove(ids: number[]): Promise<void>
}

export class GalleryItemRepository implements IGalleryItemRepository {
   async findAllItems(galleryCategoryId: number) {
      return db.query.galleryItemsTable.findMany({
         where: eq(galleryItemsTable.categoryId, galleryCategoryId),
         orderBy: (table, { desc }) => desc(table.order)
      })
   }

   async save(galleryCategoryId: number, galleryItemEntities: GalleryItemEntity[]) {
      for (const item of galleryItemEntities) {
         if (item.order == undefined || item.image == undefined) {
            throw createError({
               statusCode: 400,
               message: `Item with ID: ${item.id} is missing required fields (order or image).`,
            })
         }
      }

      const itemsToUpdate = galleryItemEntities.filter(item => item.id)
      if (itemsToUpdate.length) {
         let errorCode: number = 500
         let errorMessage: string = ''

         await db.transaction(async tx => {
            for (const item of itemsToUpdate) {
               const [updated] = await tx.update(galleryItemsTable)
                  .set({
                     image: null,
                     order: null
                  })
                  .where(eq(galleryItemsTable.id, item.id!))
                  .returning({ id: galleryItemsTable.id })

               if (!updated) {
                  errorCode = 404
                  errorMessage = `Item with ID: ${item.id} doesnt exist`
                  tx.rollback()
               }
            }

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

               const index = galleryItemEntities.findIndex(i => i.id === updated.id)
               galleryItemEntities[index] = Object.assign(updated)
            }
         }).catch(err => {
            throw createError({
               statusCode: err.message === 'Rollback' ? errorCode : (err.code || 500),
               message: err.message === 'Rollback' ? errorMessage : err.message
            })
         })
      }

      const itemsToInsert = galleryItemEntities.filter(item => !item.id)
      if (itemsToInsert.length) {
         const insertedItems = await db.insert(galleryItemsTable)
            .values(itemsToInsert.map(item => ({
               ...item,
               id: undefined,
               categoryId: galleryCategoryId
            })))
            .returning()

         for (const item of insertedItems) {
            const index = galleryItemEntities.findIndex(insertedItem => insertedItem.order === item.order)
            galleryItemEntities[index] = Object.assign(item)
         }
      }

      return [...galleryItemEntities]
   }

   async remove(ids: number[]) {
      await db.delete(galleryItemsTable).where(inArray(galleryItemsTable.id, ids))
   }
}



export interface IGalleryCategoryRepository {
   findAll(galleryId: number): Promise<GalleryCategory[]>

   findByName(name: string, galleryId: number): Promise<GalleryCategoryEntity | null>
}

export class GalleryCategoryRepository implements IGalleryCategoryRepository {
   async findAll(galleryId: number) {
      return await db.query.galleryCategoriesTable.findMany({
         where: eq(galleryCategoriesTable.galleryId, galleryId)
      })
   }

   async findByName(name: string, galleryId: number) {
      const category = await db.query.galleryCategoriesTable.findFirst({
         where: and(
            eq(galleryCategoriesTable.name, name),
            eq(galleryCategoriesTable.galleryId, galleryId)
         ),
      })
      if (!category)
         return null

      return new GalleryCategoryEntity(category)
   }
}



export interface IGalleryRepository {
   findAll(): Promise<Gallery[]>

   findByName(name: string): Promise<GalleryEntity | null>
}

export class GalleryRepository implements IGalleryRepository {
   async findAll() {
      return await db.query.galleriesTable.findMany()
   }

   async findByName(name: string) {
      const gallery = await db.query.galleriesTable.findFirst({
         where: eq(galleriesTable.name, name)
      })
      if (!gallery)
         return null

      return new GalleryEntity(gallery)
   }
}