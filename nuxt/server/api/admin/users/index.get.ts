export default defineEventHandler({
   onRequest: [
      PaginationHandler.validatePagination,
      SearchHandler.validateSearchRequest
   ],
   handler: async event => {
      const userService = new UserService()

      const [total, userList] = await Promise.all([
         userService.getTotalUsers(event.context.requestDTO.searchParam),
         event.context.requestDTO.searchParam ?
            userService.searchUsers(event.context.requestDTO.searchParam, event.context.requestDTO.pagination) :
            userService.getUsers(event.context.requestDTO.pagination)
      ])

      return {
         total,
         page: event.context.requestDTO.pagination?.page || null,
         users: userList
      }
   }
})