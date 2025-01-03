import { PostEntity } from "#imports"
import { eq, not, and, count, or, ilike, lt, gte, isNull } from "drizzle-orm";

export interface IPostRepository {
   findAll(
      lang?: Langs,
      categorySlug?: string,
      searchParam?: string,
      pagination?: { page: number | undefined, perPage: number | undefined },
      showPlanned?: boolean
   ): Promise<PostList>

   findBy(by: 'slug' | 'id', slugOrId: string | number): Promise<PostEntity | null>

   count(lang?: Langs, categorySlug?: string, searchParam?: string, showPlanned?: boolean): Promise<number>

   save(postEntity: PostEntity): Promise<PostEntity>

   removeBy(by: 'slug' | 'id', slugOrId: string | number): Promise<void>
}

export class PostRepository implements IPostRepository {
   async findAll(
      lang?: string,
      categorySlug?: string,
      searchParam?: string,
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined },
      showPlanned?: boolean
   ) {
      const isPaginationSetted = pagination.page && pagination.perPage
      const offset = isPaginationSetted && (pagination.page! - 1) * pagination.perPage!

      return db
         .select({
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
               showPlanned ?
                  undefined :
                  or(
                     isNull(postsTable.plannedAt),
                     lt(postsTable.plannedAt, new Date())
                  )
            )
         )
         .offset(offset ?? 0)
         .limit(pagination.perPage ?? 9999)
   }

   async findBy(by: 'slug' | 'id', slugOrId: string | number) {
      const result = await db.query.postsTable.findFirst({
         where: eq(postsTable[by], slugOrId)
      })
      if (!result)
         return null

      return new PostEntity(result)
   }

   async count(lang?: Langs, categorySlug?: string, searchParam?: string, showPlanned?: boolean) {
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
         await db.update(postsTable)
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
               langId: postEntity.langId,
            })
            .where(eq(postsTable.id, postEntity.id));
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
         }).returning({ id: postsTable.id, langGroup: postsTable.langGroup, createdAt: postsTable.createdAt })

         postEntity.id = inserted.id
         postEntity.langGroup = inserted.langGroup
         postEntity.createdAt = inserted.createdAt
      }

      return postEntity
   }

   async removeBy(by: 'slug' | 'id', slugOrid: string | number) {
      await db.delete(postsTable).where(eq(postsTable[by], slugOrid))
   }
}