export interface ITranslationService {
   createTranslations(post: PostEntity): Promise<void>

   syncSlugIfNeeded(slug: string, langGroup: number): Promise<void>
}

export class TranslationService implements ITranslationService {
   constructor(
      private langService: ILangService,
      private postRepository: IPostRepository
   ) { }

   async createTranslations(post: PostEntity) {
      const langs = await this.langService.getLangs()

      for (const lang of langs) {
         if (lang.id === post.langId)
            continue

         const translatedPost = new PostEntity({ ...post, id: undefined, langId: lang.id })
         await this.postRepository.save(translatedPost)
      }
   }

   async syncSlugIfNeeded(slug: string, langGroup: number) {
      const posts = await this.postRepository.findAllTranslations(langGroup)

      for (const post of posts) {
         if (post.slug === slug)
            continue

         post.slug = slug
         await this.postRepository.save(post)
      }
   }
}