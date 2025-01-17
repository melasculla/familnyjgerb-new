export interface ITranslationService {
   createPostTranslations(post: PostEntity): Promise<void>

   syncPostSlugIfNeeded(slug: string, langGroup: number): Promise<void>

   createProjectTranslations(post: ProjectEntity): Promise<void>

   syncProjectSlugIfNeeded(slug: string, langGroup: number): Promise<void>
}

export class TranslationService implements ITranslationService {
   constructor(
      private langService: ILangService,
      private repositories: {
         postRepository?: IPostRepository,
         projectRepository?: IProjectRepository,
      }
   ) { }

   async createPostTranslations(post: PostEntity) {
      if (!this.repositories.postRepository)
         return

      const langs = await this.langService.getLangs()

      for (const lang of langs) {
         if (lang.id === post.langId)
            continue

         const translatedPost = new PostEntity({ ...post, id: undefined, langId: lang.id })
         await this.repositories.postRepository.save(translatedPost)
      }
   }

   async syncPostSlugIfNeeded(slug: string, langGroup: number) {
      if (!this.repositories.postRepository)
         return

      const posts = await this.repositories.postRepository.findAllTranslations(langGroup)

      for (const post of posts) {
         if (post.slug === slug)
            continue

         post.slug = slug
         await this.repositories.postRepository.save(post)
      }
   }

   async createProjectTranslations(post: ProjectEntity) {
      if (!this.repositories.projectRepository)
         return

      const langs = await this.langService.getLangs()

      for (const lang of langs) {
         if (lang.id === post.langId)
            continue

         const translatedProject = new ProjectEntity({ ...post, id: undefined, langId: lang.id })
         await this.repositories.projectRepository.save(translatedProject)
      }
   }

   async syncProjectSlugIfNeeded(slug: string, langGroup: number) {
      if (!this.repositories.projectRepository)
         return

      const projects = await this.repositories.projectRepository.findAllTranslations(langGroup)

      for (const project of projects) {
         if (project.slug === slug)
            continue

         project.slug = slug
         await this.repositories.projectRepository.save(project)
      }
   }
}