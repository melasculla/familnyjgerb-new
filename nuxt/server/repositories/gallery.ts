import { CategoryEntity, GalleryCategoryEntity, GalleryItemEntity } from '#imports'
import { eq, inArray, and, desc, aliasedTable, arrayContains, count, arrayOverlaps } from 'drizzle-orm'
import { GalleryItemCols } from '../db/schema'
import { GalleryMainFiltersRequest } from '../handlers/gallery'

export interface IGalleryItemRepository {
   findAllItems(galleryCategoryId?: number, filters?: GalleryMainFiltersRequest, pagination?: { page?: number, perPage?: number }): Promise<Array<GalleryItem & {
      projectDetailsRu: {
         slug: string,
      } | null
      projectDetailsEn: {
         slug: string,
      } | null
   }>>

   countItems(filters: GalleryMainFiltersRequest): Promise<number>

   save(galleryCategoryId: number, galleryItemEntities: GalleryItemEntity[]): Promise<GalleryItemEntity[]>

   remove(ids: number[]): Promise<void>
}

export class GalleryItemRepository implements IGalleryItemRepository {
   async findAllItems(galleryCategoryId?: number, filters?: GalleryMainFiltersRequest, pagination?: { page?: number, perPage?: number }) {
      const projectEnTable = aliasedTable(projectsTable, 'project_en')

      const query = db
         .select({
            ...galleryItemsTable as GalleryItemCols,
            projectRu: projectsTable.id,
            projectEn: projectEnTable.id,
            projectDetailsRu: {
               slug: projectsTable.slug,
            },
            projectDetailsEn: {
               slug: projectEnTable.slug,
            },
         })
         .from(galleryItemsTable)
         .where(galleryCategoryId ? eq(galleryItemsTable.categoryId, galleryCategoryId) : undefined,)
         .leftJoin(projectsTable, eq(projectsTable.id, galleryItemsTable.projectRu))
         .leftJoin(projectEnTable, eq(projectEnTable.id, galleryItemsTable.projectEn))
         .orderBy(desc(galleryItemsTable.order))
         .$dynamic()

      if (filters)
         query
            .where(and(
               filters?.gallery ? eq(galleriesTable.name, filters.gallery) : undefined,
               (filters?.category && filters.category.length) ? inArray(galleryCategoriesTable.name, filters.category as string[]) : undefined,
               (filters?.type && filters.type.length) ? arrayOverlaps(galleryItemsTable.type, filters.type) : undefined,
               (filters?.usage && filters.usage.length) ? arrayOverlaps(galleryItemsTable.usage, filters.usage) : undefined,
               (filters?.info && filters.info.length) ? arrayOverlaps(galleryItemsTable.info, filters.info) : undefined,
            ))
            .innerJoin(galleryCategoriesTable, eq(galleryCategoriesTable.id, galleryItemsTable.categoryId))
            .innerJoin(galleriesTable, eq(galleriesTable.id, galleryCategoriesTable.galleryId))

      if (pagination && pagination.page && pagination.perPage)
         query
            .offset((pagination.page - 1) * pagination.perPage)
            .limit(pagination.perPage)

      return await query.execute()
   }

   async countItems(filters: GalleryMainFiltersRequest) {
      const [result] = await db
         .select({ count: count() })
         .from(galleryItemsTable)
         .leftJoin(projectsTable, eq(projectsTable.id, galleryItemsTable.projectRu))
         .where(and(
            filters.gallery ? eq(galleriesTable.name, filters.gallery) : undefined,
            (filters.category && filters.category.length) ? inArray(galleryCategoriesTable.name, filters.category as string[]) : undefined,
            (filters.type && filters.type.length) ? arrayOverlaps(galleryItemsTable.type, filters.type) : undefined,
            (filters.usage && filters.usage.length) ? arrayOverlaps(galleryItemsTable.usage, filters.usage) : undefined,
            (filters.info && filters.info.length) ? arrayOverlaps(galleryItemsTable.info, filters.info) : undefined,
         ))
         .innerJoin(galleryCategoriesTable, eq(galleryCategoriesTable.id, galleryItemsTable.categoryId))
         .innerJoin(galleriesTable, eq(galleriesTable.id, galleryCategoriesTable.galleryId))

      return result.count
   }

   async save(galleryCategoryId: number, galleryItemEntities: GalleryItemEntity[]) {
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

                     projectRu: item.projectRu,
                     projectEn: item.projectEn,
                     type: item.type,
                     usage: item.usage,
                     info: item.info,
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