import { eq, not, and, count, or, ilike, lt, gte, isNull } from "drizzle-orm";

export interface ILangRepository {
   findAll(): Promise<Lang[]>

   findBy(by: 'id' | 'lang', idOrLang: string | number): Promise<Lang | null>

   save(langObject: NewLang): Promise<Lang>

   removeBy(by: 'id' | 'lang', idOrLang: string | number): Promise<void>
}

export class LangRepository implements ILangRepository {
   async findAll() {
      return await db.query.langsTable.findMany()
   }

   async findBy(by: 'id' | 'lang', idOrLang: string | number) {
      const result = await db.query.langsTable.findFirst({
         where: eq(langsTable[by], idOrLang)
      })
      if (!result)
         return null

      return result
   }

   async save(langObject: NewLang) {
      if (langObject.id) {
         await db.update(langsTable).set({
            lang: langObject.lang
         }).where(eq(langsTable.id, langObject.id))
      } else {
         const [inserted] = await db.insert(langsTable).values({
            lang: langObject.lang
         }).returning({ id: langsTable.id })

         langObject.id = inserted.id
      }

      return {
         id: langObject.id!,
         lang: langObject.lang
      }
   }

   async removeBy(by: 'id' | 'lang', idOrLang: string | number) {
      await db.delete(langsTable).where(eq(langsTable[by], idOrLang))
   }
}