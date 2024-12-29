import { type H3Event, type EventHandlerRequest } from 'h3'

export class PaginationHandler {
   public static validatePagination(event: H3Event<EventHandlerRequest>) {
      const { page, perPage } = getQuery(event) as { page: string, perPage: string }
      if (page && perPage) {
         const pageInt = parseInt(page)
         const perPageInt = parseInt(perPage)
         if (!pageInt || !perPageInt)
            throw createError(errorsList.badRequest)

         event.context.requestDTO.pagination = { page: pageInt, perPage: perPageInt }
         return
      }

      event.context.requestDTO.pagination = undefined
   }
}

export class SearchHandler {
   public static validateSearchRequest(event: H3Event<EventHandlerRequest>) {
      const { searchParam } = getQuery(event) as { searchParam: string }
      if (!searchParam)
         return

      const regex = /^[^<>'"`;%$&#()]*$/
      if (typeof searchParam !== 'string' || !regex.test(searchParam))
         throw createError(errorsList.badRequest)

      event.context.requestDTO.searchParam = searchParam
   }
}

export class LocaleHandler {
   public static validateLocale(event: H3Event<EventHandlerRequest>) {
      const { locale } = getQuery(event) as { locale: Langs }
      if (!locale || !langsList.includes(locale.toLowerCase() as Langs))
         throw createError(errorsList.badRequest)

      event.context.requestDTO.locale = locale
   }
}