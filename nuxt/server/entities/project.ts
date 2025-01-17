export class ProjectEntity {
   public id
   public slug
   public title
   public description
   public content
   public usuage
   public sketches
   public thumbnail
   public video
   public status
   public editedAt
   public createdAt
   public seoKeys
   public ogImage
   public langId
   public langGroup

   constructor(project: NewProject) {
      this.id = project.id || null
      this.slug = project.slug
      this.title = project.title
      this.description = project.description || null
      this.content = project.content || null
      this.usuage = project.usuage || null
      this.sketches = project.sketches || null
      this.thumbnail = project.thumbnail || null
      this.video = project.video || null
      this.status = project.status
      this.editedAt = new Date()
      this.createdAt = project.createdAt
      this.seoKeys = project.seoKeys || null
      this.ogImage = project.ogImage || null
      this.langId = project.langId || null
      this.langGroup = project.langGroup || null
   }

   async assignLangGroup(repository: IProjectRepository) {
      const existingProject = await repository.findBy('slug', this.slug)
      this.langGroup = existingProject ? existingProject.langGroup : null
   }
}