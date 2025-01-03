export class GalleryItemEntity {
   public id
   public image
   public title
   public altEn
   public altRu
   public order
   public categoryId

   constructor(galleryItem: NewGalleryItem) {
      this.id = galleryItem.id || null
      this.image = galleryItem.image
      this.title = galleryItem.title || null
      this.altEn = galleryItem.altEn || null
      this.altRu = galleryItem.altRu || null
      this.order = galleryItem.order
      this.categoryId = galleryItem.categoryId
   }
}