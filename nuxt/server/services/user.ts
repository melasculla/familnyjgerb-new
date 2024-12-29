import { UserEntity } from "#imports";

export interface IUserService {
   getTotalUsers(searchParam?: string | undefined): Promise<number>

   getUsers(pagination?: {
      page: number | undefined;
      perPage: number | undefined;
   }): Promise<UserList>;

   getUserBy(by: "email" | "uid", emailOrUID: string): Promise<UserEntity>

   upsertUser(userObject: NewUser): Promise<UserEntity>

   searchUsers(param: string, pagination?: {
      page: number | undefined;
      perPage: number | undefined;
   }): Promise<UserList>;

   deleteUser(id: number): Promise<void>;
}

export class UserService implements IUserService {
   private repository: IUserRepository;

   constructor() {
      this.repository = new UserRepository()
   }

   async getTotalUsers(searchParam?: string) {
      return await this.repository.count(searchParam)
   }

   async getUsers(
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined }
   ) {
      const userList = await this.repository.findAll(pagination)
      if (!userList.length)
         throw createError(errorsList.notFound(`${pagination.page ? 'On page ' + pagination.page + ' ' : ''} Users`))

      return userList
   }

   async getUserBy(by: 'email' | 'uid', emailOrUID: string) {
      const user = await this.repository.findBy(by, emailOrUID)
      if (!user)
         throw createError(errorsList.notFound('User'))

      return user
   }

   async upsertUser(userObject: NewUser) {
      const user = new UserEntity(userObject)
      return await this.repository.save(user)
   }

   async searchUsers(
      param: string,
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined }
   ) {
      const result = await this.repository.find(param, pagination)
      if (!result || !result.length)
         throw createError(errorsList.notFound(`For query "${param}"${pagination.page ? ', on page ' + pagination.page : ' '} users`))

      return result
   }

   async deleteUser(id: number) {
      await this.repository.removeBy('id', id)
   }
}