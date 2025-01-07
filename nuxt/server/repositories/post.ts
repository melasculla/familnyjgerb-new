import { PostEntity } from "#imports"
import { eq, not, and, count, or, ilike, lt, gte, isNull, inArray, desc } from "drizzle-orm";

export interface IPostRepository {
   findAll(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      showPlanned?: boolean,
      showHidden?: boolean,
      showDeleted?: boolean,
   ): Promise<PostList>

   findAllTranslations(langGroup: number): Promise<PostEntity[]>

   findBy(by: 'slug' | 'id', slugOrId: string | number, langId?: number): Promise<PostEntity | null>

   count(lang?: Langs, categorySlug?: string, searchParam?: string, showPlanned?: boolean, showHidden?: boolean, showDeleted?: boolean): Promise<number>

   save(postEntity: PostEntity): Promise<PostEntity>

   removeBy(by: 'slug' | 'id', slugOrId: string | number): Promise<void>
}

export class PostRepository implements IPostRepository {
   async findAll(
      lang?: string,
      categorySlug?: string,
      searchParam?: string,
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined },
      showPlanned?: boolean,
      showHidden?: boolean,
      showDeleted?: boolean,
   ) {
      const isPaginationSetted = pagination.page && pagination.perPage
      const offset = isPaginationSetted && (pagination.page! - 1) * pagination.perPage!

      return db
         .select({
            id: postsTable.id,
            slug: postsTable.slug,
            title: postsTable.title,
            thumbnail: postsTable.thumbnail,
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
               lang ? eq(langsTable.lang, lang) : undefined,
               categorySlug ? eq(categoriesTable.slug, categorySlug) : undefined,
               searchParam ? or(
                  ilike(postsTable.title, `%${searchParam}%`),
                  ilike(postsTable.description, `%${searchParam}%`),
               ) : undefined,
               showPlanned ? undefined :
                  or(
                     isNull(postsTable.plannedAt),
                     lt(postsTable.plannedAt, new Date())
                  ),
               showHidden ? inArray(postsTable.status, ['published', 'hidden']) : undefined,
               showDeleted ? eq(postsTable.status, 'deleted') : undefined,
            )
         )
         .offset(offset ?? 0)
         .limit(pagination.perPage ?? 9999)
         .orderBy(desc(postsTable.createdAt))
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
         ),
         // with: {
         //    category: {
         //       columns: {
         //          slug: true
         //       }
         //    }
         // }
         // TODO make category in entity
      })
      if (!result)
         return null

      return new PostEntity(result)
   }

   async count(lang?: Langs, categorySlug?: string, searchParam?: string, showPlanned?: boolean, showHidden?: boolean, showDeleted?: boolean) {
      const [result] = await db
         .select({ count: count() })
         .from(postsTable)
         .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
         .leftJoin(langsTable, eq(postsTable.langId, langsTable.id))
         .where(
            and(
               lang ? eq(langsTable.lang, lang) : undefined,
               categorySlug ? eq(categoriesTable.slug, categorySlug) : undefined,
               searchParam ? or(
                  ilike(postsTable.title, `%${searchParam}%`),
                  ilike(postsTable.description, `%${searchParam}%`),
               ) : undefined,
               showPlanned ?
                  undefined :
                  or(
                     isNull(postsTable.plannedAt),
                     lt(postsTable.plannedAt, new Date())
                  )
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