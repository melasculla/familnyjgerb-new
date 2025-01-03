export interface IPostService {
   getPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      isAdmin?: boolean
   ): Promise<PostList>;

   getPostBy(by: 'slug' | 'id', slugOrId: string | number): Promise<PostEntity>

   getTotalPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      isAdmin?: boolean
   ): Promise<number>

   upsertPost(postObject: NewPost): Promise<PostEntity>

   deletePost(id: number): Promise<void>;
}

export class PostService implements IPostService {
   private repository: IPostRepository

   constructor() {
      this.repository = new PostRepository()
   }

   async getPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      isAdmin?: boolean
   ) {
      return await this.repository.findAll(lang, categorySlug, searchParam, pagination, isAdmin)
   }

   async getPostBy(by: 'slug' | 'id', slugOrId: string | number) {
      const post = await this.repository.findBy(by, slugOrId)
      if (!post)
         throw createError(errorsList.notFound('Post'))

      return post
   }

   async getTotalPosts(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      isAdmin?: boolean
   ) {
      return await this.repository.count(lang, categorySlug, searchParam, isAdmin)
   }

   async upsertPost(postObject: NewPost) {
      const existingPost = await this.repository.findBy('slug', postObject.slug)

      const post = new PostEntity({ ...postObject, langGroup: existingPost?.langGroup })
      return await this.repository.save(post)
   }

   async deletePost(id: number) {
      await this.repository.removeBy('id', id)
   }
}