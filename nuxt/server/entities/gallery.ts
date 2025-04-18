export class GalleryItemEntity {
   public id
   public image
   public title
   public altEn
   public altRu
   public order
   public categoryId
   public projectRu
   public projectEn
   public type
   public usage
   public info

   constructor(galleryItem: NewGalleryItem) {
      this.id = galleryItem.id || null
      this.image = galleryItem.image as string
      this.title = galleryItem.title || null
      this.altEn = galleryItem.altEn || null
      this.altRu = galleryItem.altRu || null
      this.order = galleryItem.order
      this.categoryId = galleryItem.categoryId

      this.projectRu = galleryItem.projectRu
      this.projectEn = galleryItem.projectEn
      this.type = galleryItem.type
      this.usage = galleryItem.usage
      this.info = galleryItem.info
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