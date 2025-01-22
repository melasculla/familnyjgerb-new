export interface IPostService {
   getPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      showPlanned?: boolean,
      statuses?: PostStatus[],
   ): Promise<PostList>

   // TODO: get similar by category

   getPostBy(by: 'slug' | 'id', slugOrId: string | number, langId: number): Promise<PostEntity>

   getTotalPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      showPlanned?: boolean,
      statuses?: PostStatus[],
   ): Promise<number>

   getAdjacents(id: number, langId: number): Promise<{ prev?: string, next?: string }>

   upsertPost(postObject: NewPost): Promise<PostEntity>

   deletePost(id: number): Promise<void>
}

export class PostService implements IPostService {
   private repository: IPostRepository
   private translationService: ITranslationService

   constructor() {
      this.repository = new PostRepository()
      this.translationService = new TranslationService(new LangService(), { postRepository: this.repository })
   }

   async getPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      showPlanned?: boolean,
      statuses?: PostStatus[],
   ) {
      return await this.repository.findAll(lang, categorySlug, searchParam, pagination, showPlanned, statuses)
   }

   async getPostBy(by: 'slug' | 'id', slugOrId: string | number, langId: number) {
      const post = await this.repository.findBy(by, slugOrId, langId)

      if (!post) {
         const originalPost = await this.repository.findBy(by, slugOrId)
         if (!originalPost)
            throw createError(errorsList.notFound('Post'))

         const newPost = new PostEntity({
            ...Object.assign(originalPost),
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
      showPlanned?: boolean,
      statuses?: PostStatus[],
   ) {
      return await this.repository.count(lang, categorySlug, searchParam, showPlanned, statuses)
   }

   async getAdjacents(id: number, langId: number) {
      const { prev, next } = await this.repository.findNear(id, langId)
      return { prev, next }
   }

   async upsertPost(postObject: NewPost) {
      const post = new PostEntity(postObject)
      if (!post.id)
         await post.assignLangGroup(this.repository)

      const upsertedPost = await this.repository.save(post)

      if (postObject.id)
         this.translationService
            .syncPostSlugIfNeeded(upsertedPost.slug, upsertedPost.langGroup!).catch(err => console.warn(`[POSTS]: Sync slug failed: ${err}`))

      if (!postObject.id)
         this.translationService
            .createPostTranslations(upsertedPost).catch(err => console.warn(`[POSTS]: Creating translations failed: ${err}`))

      return upsertedPost
   }

   async deletePost(id: number) {
      await this.repository.removeBy('id', id)
   }
}