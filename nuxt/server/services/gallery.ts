export interface IGalleryItemService {
   getItems(galleryCategoryId: number): Promise<GalleryItem[]>

   upsertItems(galleryCategoryId: number, galleryItemObjects: GalleryItem[]): Promise<GalleryItemEntity[]>

   removeItem(id: number): void
}

export class GalleryItemService implements IGalleryItemService {
   private repository: IGalleryItemRepository

   constructor() {
      this.repository = new GalleryItemRepository()
   }

   async getItems(galleryCategoryId: number) {
      return await this.repository.findAllItems(galleryCategoryId)
   }

   async upsertItems(galleryCategoryId: number, galleryItemObjects: NewGalleryItem[]) {
      const galleryItemEntities = await this.repository.save(galleryCategoryId, galleryItemObjects.map(item => new GalleryItemEntity(item)))
      return galleryItemEntities
   }

   async removeItem(id: number) {
      await this.repository.remove(id)
   }
}