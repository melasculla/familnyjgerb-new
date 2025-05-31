export interface IProjectService {
   getProjects(
      lang?: Langs,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      statuses?: ProjectStatus[],
      random?: boolean,
      exclude?: number[]
   ): Promise<ProjectList>

   getProjectBy(by: 'slug' | 'id', slugOrId: string | number, langId: number): Promise<ProjectEntity>

   getTotalProjects(
      lang?: Langs,
      searchParam?: string,
      statuses?: ProjectStatus[],
      exclude?: number[]
   ): Promise<number>

   getAdjacents(id: number, langId: number): Promise<{ prev?: string, next?: string }>

   upsertProject(projectObject: NewProject): Promise<ProjectEntity>

   deleteProject(id: number): Promise<void>
}

export class ProjectService implements IProjectService {
   private repository: IProjectRepository
   private translationService: ITranslationService

   constructor() {
      this.repository = new ProjectRepository()
      this.translationService = new TranslationService(new LangService(), { projectRepository: this.repository })
   }

   async getProjects(
      lang?: Langs,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      statuses?: ProjectStatus[],
      random?: boolean,
      exclude?: number[]
   ) {
      return await this.repository.findAll(lang, searchParam, pagination, statuses, random, exclude)
   }

   async getProjectBy(by: 'slug' | 'id', slugOrId: string | number, langId: number) {
      const project = await this.repository.findBy(by, slugOrId, langId)

      if (!project) {
         const originalProject = await this.repository.findBy(by, slugOrId)
         if (!originalProject)
            throw createError(errorsList.notFound('Project'))

         const newProject = new ProjectEntity({
            ...Object.assign(originalProject),
            id: undefined,
            langId,
            title: `${originalProject.title} (Перевод скоро будет)`,
         })

         return await this.repository.save(newProject)
      }

      return project
   }

   async getTotalProjects(
      lang?: Langs,
      searchParam?: string,
      statuses?: ProjectStatus[],
      exclude?: number[]
   ) {
      return await this.repository.count(lang, searchParam, statuses, exclude)
   }

   async getAdjacents(id: number, langId: number) {
      const { prev, next } = await this.repository.findNear(id, langId)
      return { prev, next }
   }

   async upsertProject(projectObject: NewProject) {
      const project = new ProjectEntity(projectObject)
      if (!project.id)
         await project.assignLangGroup(this.repository)

      const upsertedProject = await this.repository.save(project)

      if (projectObject.id)
         this.translationService
            .syncProjectSlugIfNeeded(upsertedProject.slug, upsertedProject.langGroup!).catch(err => console.warn(`[PROJECTS]: Sync slug failed: ${err}`))

      // if (!projectObject.id)
      //    this.translationService
      //       .createProjectTranslations(upsertedProject).catch(err => console.warn(`[PROJECTS]: Creating translations failed: ${err}`))

      return upsertedProject
   }

   async deleteProject(id: number) {
      await this.repository.removeBy('id', id)
   }
}