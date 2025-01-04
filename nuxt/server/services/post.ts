export interface IPostService {
   getPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      isAdmin?: boolean,
      showHidden?: boolean,
      showDeleted?: boolean
   ): Promise<PostList>;

   getPostBy(by: 'slug' | 'id', slugOrId: string | number, langId: number): Promise<PostEntity>

   getTotalPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      isAdmin?: boolean,
      showHidden?: boolean,
      showDeleted?: boolean,
   ): Promise<number>

   upsertPost(postObject: NewPost): Promise<PostEntity>

   deletePost(id: number): Promise<void>;
}

export class PostService implements IPostService {
   private repository: IPostRepository
   private translationService: ITranslationService

   constructor() {
      this.repository = new PostRepository()
      this.translationService = new TranslationService(new LangService(), this.repository)
   }

   async getPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      isAdmin?: boolean,
      showHidden?: boolean,
      showDeleted?: boolean
   ) {
      return await this.repository.findAll(lang, categorySlug, searchParam, pagination, isAdmin, showHidden, showDeleted)
   }

   async getPostBy(by: 'slug' | 'id', slugOrId: string | number, langId: number) {
      const post = await this.repository.findBy(by, slugOrId, langId)

      if (!post) {
         const originalPost = await this.repository.findBy(by, slugOrId)
         if (!originalPost)
            throw createError(errorsList.notFound('Post'))

         const newPost = new PostEntity({
            ...originalPost,
            id: undefined,
            langId,
            title: `${originalPost.title} (Перевод скоро будет)`,
         })

         return await this.repository.save(newPost)
      }

      return post
   }

   async getTotalPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      isAdmin?: boolean,
      showHidden?: boolean,
      showDeleted?: boolean,
   ) {
      return await this.repository.count(lang, categorySlug, searchParam, isAdmin, showHidden, showDeleted)
   }

   async upsertPost(postObject: NewPost) {
      const post = new PostEntity(postObject)
      if (!post.id)
         await post.assignLangGroup(this.repository)

      const upsertedPost = await this.repository.save(post)

      if (postObject.id)
         this.translationService
            .syncSlugIfNeeded(upsertedPost.slug, upsertedPost.langGroup!).catch(err => console.warn(`[POSTS]: Sync slug failed: ${err}`))

      if (!postObject.id)
         this.translationService
            .createTranslations(upsertedPost).catch(err => console.warn(`[POSTS]: Creating translations failed: ${err}`))

      return upsertedPost
   }

   async deletePost(id: number) {
      await this.repository.removeBy('id', id)
   }
}