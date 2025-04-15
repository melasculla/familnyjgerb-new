import { PostEntity } from "#imports"
import { eq, sql, and, count, or, ilike, lt, gt, isNull, inArray, desc, SQLWrapper, isNotNull, notInArray } from "drizzle-orm";

export interface IPostRepository {
   findAll(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      showPlanned?: 'false' | 'true' | 'only',
      statuses?: PostStatus[],
      random?: boolean,
      exclude?: number[]
   ): Promise<PostList>

   findAllTranslations(langGroup: number): Promise<PostEntity[]>

   findBy(by: 'slug' | 'id', slugOrId: string | number, langId?: number): Promise<PostEntity | null>

   findNear(createdAt: Date, langId: number): Promise<{ prev?: string, next?: string }>

   count(lang?: Langs, categorySlug?: string, searchParam?: string, showPlanned?: 'false' | 'true' | 'only', statuses?: PostStatus[], exclude?: number[]): Promise<number>

   save(postEntity: PostEntity): Promise<PostEntity>

   removeBy(by: 'slug' | 'id', slugOrId: string | number): Promise<void>
}

export class PostRepository implements IPostRepository {
   async findAll(
      lang?: string,
      categorySlug?: string,
      searchParam?: string,
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined },
      showPlanned?: 'false' | 'true' | 'only',
      statuses?: PostStatus[],
      random?: boolean,
      exclude?: number[]
   ) {
      const isPaginationSetted = pagination.page && pagination.perPage
      const offset = isPaginationSetted && (pagination.page! - 1) * pagination.perPage!

      return db
         .select({
            id: postsTable.id,
            slug: postsTable.slug,
            title: postsTable.title,
            thumbnail: postsTable.thumbnail,
            status: postsTable.status,
            createdAt: postsTable.createdAt,
            lang: {
               id: langsTable.id,
               lang: langsTable.lang,
            },
            category: {
               id: categoriesTable.id,
               slug: categoriesTable.slug,
               nameRu: categoriesTable.nameRu,
               nameEn: categoriesTable.nameEn,
            },
         })
         .from(postsTable)
         .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
         .leftJoin(langsTable, eq(postsTable.langId, langsTable.id))
         .where(
            and(
               lang ?
                  eq(langsTable.lang, lang) :
                  undefined,
               categorySlug ?
                  eq(categoriesTable.slug, categorySlug) :
                  undefined,
               searchParam ?
                  or(
                     ilike(postsTable.title, `%${searchParam}%`),
                     ilike(postsTable.description, `%${searchParam}%`),
                  )
                  : undefined,
               ((): SQLWrapper | undefined => {
                  if (showPlanned === 'true')
                     return undefined

                  if (showPlanned === 'only')
                     return and(isNotNull(postsTable.plannedAt), gt(postsTable.plannedAt, new Date()))

                  return or(isNull(postsTable.plannedAt), lt(postsTable.plannedAt, new Date()))
               })(),
               inArray(postsTable.status, statuses || ['published']),
               exclude ? notInArray(postsTable.id, exclude) : undefined
            )
         )
         .offset(offset ?? 0)
         .limit(pagination.perPage ?? 9999)
         .orderBy(random ? sql`RANDOM()` : desc(postsTable.createdAt))
   }

   async findAllTranslations(langGroup: number) {
      const result = await db.query.postsTable.findMany({
         where: eq(postsTable.langGroup, langGroup)
      })

      return result.map(item => new PostEntity(item))
   }

   async findBy(by: 'slug' | 'id', slugOrId: string | number, langId?: number) {
      const result = await db.query.postsTable.findFirst({
         where: and(
            eq(postsTable[by], slugOrId),
            langId ? eq(postsTable.langId, langId) : undefined
         )
      })
      if (!result)
         return null

      return new PostEntity(result)
   }

   async findNear(createdAt: Date, langId: number) {
      const [prev, next] = await Promise.all([
         db.query.postsTable.findFirst({
            columns: { slug: true },
            where: and(
               // gt(postsTable.id, id),
               gt(postsTable.createdAt, createdAt),
               eq(postsTable.status, 'published'),
               eq(postsTable.langId, langId)
            ),
            orderBy: (postsTable, { asc }) => [asc(postsTable.createdAt)]
         }),
         db.query.postsTable.findFirst({
            columns: { slug: true },
            where: and(
               // lt(postsTable.id, id),
               lt(postsTable.createdAt, createdAt),
               eq(postsTable.status, 'published'),
               eq(postsTable.langId, langId)
            ),
            orderBy: (postsTable, { desc }) => [desc(postsTable.createdAt)]
         })
      ])

      return {
         prev: prev?.slug,
         next: next?.slug
      }
   }

   async count(lang?: Langs, categorySlug?: string, searchParam?: string, showPlanned?: 'false' | 'true' | 'only', statuses?: PostStatus[], exclude?: number[]) {
      const [result] = await db
         .select({ count: count() })
         .from(postsTable)
         .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
         .leftJoin(langsTable, eq(postsTable.langId, langsTable.id))
         .where(
            and(
               lang ? eq(langsTable.lang, lang) : undefined,
               categorySlug ?
                  eq(categoriesTable.slug, categorySlug) :
                  undefined,
               searchParam ?
                  or(
                     ilike(postsTable.title, `%${searchParam}%`),
                     ilike(postsTable.description, `%${searchParam}%`),
                  ) :
                  undefined,
               ((): SQLWrapper | undefined => {
                  if (showPlanned === 'true')
                     return undefined

                  if (showPlanned === 'only')
                     return and(isNotNull(postsTable.plannedAt), gt(postsTable.plannedAt, new Date()))

                  return or(isNull(postsTable.plannedAt), lt(postsTable.plannedAt, new Date()))
               })(),
               inArray(postsTable.status, statuses || ['published']),
               exclude ? notInArray(postsTable.id, exclude) : undefined
            )
         )

      return result.count
   }

   async save(postEntity: PostEntity) {
      if (postEntity.id) {
         const [updated] = await db.update(postsTable)
            .set({
               slug: postEntity.slug,
               title: postEntity.title,
               description: postEntity.description,
               content: postEntity.content,
               gallery: postEntity.gallery,
               thumbnail: postEntity.thumbnail,
               status: postEntity.status,
               plannedAt: postEntity.plannedAt,
               editedAt: postEntity.editedAt,
               seoKeys: postEntity.seoKeys,
               categoryId: postEntity.categoryId,
            })
            .where(
               and(
                  eq(postsTable.id, postEntity.id),
                  eq(postsTable.langId, postEntity.langId!),
               )
            ).returning()

         postEntity = Object.assign(updated)

         if (!updated)
            throw createError(errorsList.notFound(`Post with langID: ${postEntity.langId}`))
      } else {
         const [inserted] = await db.insert(postsTable).values({
            slug: postEntity.slug,
            title: postEntity.title,
            description: postEntity.description,
            content: postEntity.content,
            gallery: postEntity.gallery,
            thumbnail: postEntity.thumbnail,
            status: postEntity.status,
            plannedAt: postEntity.plannedAt,
            seoKeys: postEntity.seoKeys,
            categoryId: postEntity.categoryId,
            langId: postEntity.langId,
            langGroup: postEntity.langGroup,
         }).returning()

         postEntity = Object.assign(inserted)
      }

      return postEntity
   }

   async removeBy(by: 'slug' | 'id', slugOrid: string | number) {
      await db.delete(postsTable).where(eq(postsTable[by], slugOrid))
   }
}