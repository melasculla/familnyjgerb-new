export class CategoryEntity {
   public id
   public slug
   public nameRu
   public nameEn

   constructor(category: NewCategory) {
      this.id = category.id || null
      this.slug = category.slug
      this.nameRu = category.nameRu
      this.nameEn = category.nameEn || null
   }
}