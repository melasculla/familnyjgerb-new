export class PostEntity {
   public id
   public slug
   public title
   public description
   public content
   public gallery
   public thumbnail
   public status
   public plannedAt
   public editedAt
   public createdAt
   public seoKeys
   public categoryId
   public langId
   public langGroup

   constructor(post: NewPost) {
      this.id = post.id || null
      this.slug = post.slug
      this.title = post.title
      this.description = post.description || null
      this.content = post.content || null
      this.gallery = post.gallery || null
      this.thumbnail = post.thumbnail || null
      this.status = post.status
      this.plannedAt = this.convertISOStringToDate(post.plannedAt) || null
      this.editedAt = post.editedAt || new Date()
      this.createdAt = this.convertISOStringToDate(post.createdAt)
      this.seoKeys = post.seoKeys || null
      this.categoryId = post.categoryId || null
      this.langId = post.langId
      this.langGroup = post.langGroup || null
   }

   private convertISOStringToDate(date?: string | Date | null) {
      if (!date)
         return undefined

      return typeof date === 'string' ? new Date(date) : date
   }

   async assignLangGroup(repository: IPostRepository) {
      const existingPost = await repository.findBy('slug', this.slug)
      this.langGroup = existingPost ? existingPost.langGroup : null
   }
}