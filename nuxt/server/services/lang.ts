export interface ILangService {
   getLangs(): Promise<Lang[]>

   getLangBy(by: 'id' | 'lang', idOrLang: string | number): Promise<Lang>
}

export class LangService implements ILangService {
   private repository: ILangRepository

   constructor() {
      this.repository = new LangRepository()
   }

   async getLangs() {
      return await this.repository.findAll()
   }

   async getLangBy(by: 'id' | 'lang', idOrLang: string | number) {
      const lang = await this.repository.findBy(by, idOrLang)
      if (!lang)
         throw createError(errorsList.notFound('Lang'))

      return lang
   }
}