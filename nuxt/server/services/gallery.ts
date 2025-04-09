import { GalleryMainFiltersRequest } from '../handlers/gallery'

export interface IGalleryItemService {
   getMainItems(filters: GalleryMainFiltersRequest): Promise<{
      items: Awaited<ReturnType<IGalleryItemRepository['findAllItems']>>
      total: number
   }>

   getItems(galleryCategoryId: number): ReturnType<IGalleryItemRepository['findAllItems']>

   upsertItems(galleryCategoryId: number, galleryItemObjects: GalleryItem[]): Promise<GalleryItemEntity[]>

   deleteItems(ids: number[]): void
}

export class GalleryItemService implements IGalleryItemService {
   constructor(
      private repository: IGalleryItemRepository = new GalleryItemRepository()
   ) { }

   async getMainItems(filters: GalleryMainFiltersRequest, pagination: { page?: number, perPage?: number } = {}) {
      const [items, total] = await Promise.all([
         this.repository.findAllItems(undefined, filters, pagination),
         this.repository.countItems(filters)
      ])

      return { items, total }
   }

   async getItems(galleryCategoryId: number) {
      return await this.repository.findAllItems(galleryCategoryId)
   }

   async upsertItems(galleryCategoryId: number, galleryItemObjects: NewGalleryItem[]) {
      const galleryItemEntities = galleryItemObjects.map(item => new GalleryItemEntity(item))

      for (const item of galleryItemEntities) {
         if (item.order == undefined || item.image == undefined) {
            throw createError({
               statusCode: 400,
               message: `Item with ID: ${item.id} is missing required fields (order or image).`,
            })
         }
      }

      const result = await this.repository.save(
         galleryCategoryId,
         galleryItemEntities
      )

      return result
   }

   async deleteItems(ids: number[]) {
      await this.repository.remove(ids)
   }
}



export interface IGalleryCategoryService {
   getAll(galleryId: number): Promise<GalleryCategory[]>

   getCategoryByName(name: string, galleryId: number): Promise<GalleryCategoryEntity>

   // TODO: add upsert and delete
}

export class GalleryCategoryService implements IGalleryCategoryService {
   private repository: IGalleryCategoryRepository

   constructor() {
      this.repository = new GalleryCategoryRepository()
   }

   async getAll(galleryId: number) {
      return await this.repository.findAll(galleryId)
   }

   async getCategoryByName(name: string, galleryId: number) {
      const category = await this.repository.findByName(name, galleryId)
      if (!category)
         throw createError(errorsList.notFound('Gallery category'))

      return category
   }
}



export interface IGalleryService {
   getGalleries(): Promise<Gallery[]>

   getGalleryByName(name: string): Promise<GalleryEntity>

   // TODO: add upsert and delete
}

export class GalleryService implements IGalleryService {
   private repository: IGalleryRepository

   constructor() {
      this.repository = new GalleryRepository()
   }

   async getGalleries() {
      return await this.repository.findAll()
   }

   async getGalleryByName(name: string) {
      const gallery = await this.repository.findByName(name)
      if (!gallery)
         throw createError(errorsList.notFound('Gallery'))

      return gallery
   }
}