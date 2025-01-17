import { ProjectEntity } from "#imports"
import { eq, not, and, count, or, ilike, lt, gt, isNull, inArray, desc } from "drizzle-orm";

export interface IProjectRepository {
   findAll(
      lang?: Langs,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      statuses?: ProjectStatus[],
   ): Promise<ProjectList>

   findAllTranslations(langGroup: number): Promise<ProjectEntity[]>

   findBy(by: 'slug' | 'id', slugOrId: string | number, langId?: number): Promise<ProjectEntity | null>

   findNear(id: number, langId: number): Promise<{ prev?: string, next?: string }>

   count(lang?: Langs, searchParam?: string, statuses?: ProjectStatus[]): Promise<number>

   save(projectEntity: ProjectEntity): Promise<ProjectEntity>

   removeBy(by: 'slug' | 'id', slugOrId: string | number): Promise<void>
}

export class ProjectRepository implements IProjectRepository {
   async findAll(
      lang?: Langs,
      searchParam?: string,
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined },
      statuses?: ProjectStatus[],
   ) {
      const isPaginationSetted = pagination.page && pagination.perPage
      const offset = isPaginationSetted && (pagination.page! - 1) * pagination.perPage!

      return db
         .select({
            id: projectsTable.id,
            slug: projectsTable.slug,
            title: projectsTable.title,
            description: projectsTable.description,
            thumbnail: projectsTable.thumbnail,
            createdAt: projectsTable.createdAt,
            lang: {
               id: langsTable.id,
               lang: langsTable.lang,
            },
         })
         .from(projectsTable)
         .leftJoin(langsTable, eq(projectsTable.langId, langsTable.id))
         .where(
            and(
               lang ?
                  eq(langsTable.lang, lang) :
                  undefined,
               searchParam ?
                  or(
                     ilike(projectsTable.title, `%${searchParam}%`),
                     ilike(projectsTable.description, `%${searchParam}%`),
                  )
                  : undefined,
               inArray(projectsTable.status, statuses || ['published'])
            )
         )
         .offset(offset ?? 0)
         .limit(pagination.perPage ?? 9999)
         .orderBy(desc(projectsTable.createdAt))
   }

   async findAllTranslations(langGroup: number) {
      const result = await db.query.projectsTable.findMany({
         where: eq(projectsTable.langGroup, langGroup)
      })

      return result.map(item => new ProjectEntity(item))
   }

   async findBy(by: 'slug' | 'id', slugOrId: string | number, langId?: number) {
      const result = await db.query.projectsTable.findFirst({
         where: and(
            eq(projectsTable[by], slugOrId),
            langId ? eq(projectsTable.langId, langId) : undefined
         )
      })
      if (!result)
         return null

      return new ProjectEntity(result)
   }

   async findNear(id: number, langId: number) {
      const [prev, next] = await Promise.all([
         db.query.projectsTable.findFirst({
            columns: { slug: true },
            where: and(
               gt(projectsTable.id, id),
               eq(projectsTable.status, 'published'),
               eq(projectsTable.langId, langId)
            ),
            orderBy: (projectsTable, { asc }) => [asc(projectsTable.id)]
         }),
         db.query.projectsTable.findFirst({
            columns: { slug: true },
            where: and(
               lt(projectsTable.id, id),
               eq(projectsTable.status, 'published'),
               eq(projectsTable.langId, langId)
            ),
            orderBy: (projectsTable, { desc }) => [desc(projectsTable.id)]
         })
      ])

      return {
         prev: prev?.slug,
         next: next?.slug
      }
   }

   async count(lang?: Langs, searchParam?: string, statuses?: ProjectStatus[]) {
      const [result] = await db
         .select({ count: count() })
         .from(projectsTable)
         .leftJoin(langsTable, eq(projectsTable.langId, langsTable.id))
         .where(
            and(
               lang ? eq(langsTable.lang, lang) : undefined,
               searchParam ?
                  or(
                     ilike(projectsTable.title, `%${searchParam}%`),
                     ilike(projectsTable.description, `%${searchParam}%`),
                  ) :
                  undefined,
               inArray(projectsTable.status, statuses || ['published'])
            )
         )

      return result.count
   }

   async save(projectEntity: ProjectEntity) {
      if (projectEntity.id) {
         const [updated] = await db.update(projectsTable)
            .set({
               slug: projectEntity.slug,
               title: projectEntity.title,
               description: projectEntity.description,
               content: projectEntity.content,
               usuage: projectEntity.usuage,
               sketches: projectEntity.sketches,
               thumbnail: projectEntity.thumbnail,
               video: projectEntity.video,
               status: projectEntity.status,
               editedAt: projectEntity.editedAt,
               createdAt: projectEntity.createdAt,
               seoKeys: projectEntity.seoKeys,
               ogImage: projectEntity.ogImage,
            })
            .where(
               and(
                  eq(projectsTable.id, projectEntity.id),
                  eq(projectsTable.langId, projectEntity.langId!),
               )
            ).returning()

         projectEntity = Object.assign(updated)

         if (!updated)
            throw createError(errorsList.notFound(`Project with langID: ${projectEntity.langId}`))
      } else {
         const [inserted] = await db.insert(projectsTable).values({
            slug: projectEntity.slug,
            title: projectEntity.title,
            description: projectEntity.description,
            content: projectEntity.content,
            usuage: projectEntity.usuage,
            sketches: projectEntity.sketches,
            thumbnail: projectEntity.thumbnail,
            video: projectEntity.video,
            status: projectEntity.status,
            seoKeys: projectEntity.seoKeys,
            ogImage: projectEntity.ogImage,
            langId: projectEntity.langId,
            langGroup: projectEntity.langGroup,
         }).returning()

         projectEntity = Object.assign(inserted)
      }

      return projectEntity
   }

   async removeBy(by: 'slug' | 'id', slugOrid: string | number) {
      await db.delete(projectsTable).where(eq(projectsTable[by], slugOrid))
   }
}