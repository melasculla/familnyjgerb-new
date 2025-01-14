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

export class GalleryCategoryEntity {
   public id
   public name
   public galleryId

   constructor(galleryCategory: NewGalleryCategory) {
      this.id = galleryCategory.id || null
      this.name = galleryCategory.name
      this.galleryId = galleryCategory.galleryId
   }
}

export class GalleryEntity {
   public id
   public name

   constructor(gallery: NewGallery) {
      this.id = gallery.id || null
      this.name = gallery.name
   }
}