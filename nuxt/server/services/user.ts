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
   }): Promise<UserList>

   deleteUser(id: number): Promise<void>

   // Accounts
   getUserAccounts(id: number): Promise<AccountList>

   getUserAccountBy(by: 'id' | 'userId' | 'provider', column: number | { provider: string, providerAccountId: string }): Promise<AccountEntity>

   getTotalUserAccounts(id: number): Promise<number>

   upsertUserAccount(accountObject: NewAccount): Promise<AccountEntity>

   deleteUserAccount(id: number): Promise<void>
}

export class UserService implements IUserService {
   private repository: IUserRepository
   private accountRepository: IAccountRepository

   constructor() {
      this.repository = new UserRepository()
      this.accountRepository = new AccountRepository()
   }

   async getTotalUsers(searchParam?: string) {
      return await this.repository.count(searchParam)
   }

   async getUsers(
      pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined }
   ) {
      return await this.repository.findAll(pagination)
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

   // Accounts
   async getUserAccounts(id: number) {
      return await this.accountRepository.findAllForUser(id)
   }

   async getUserAccountBy(by: 'id' | 'userId' | 'provider', column: number | { provider: string, providerAccountId: string }) {
      const account = await this.accountRepository.findBy(by, column)
      if (!account)
         throw createError(errorsList.notFound('Account'))

      return account
   }

   async getTotalUserAccounts(id: number) {
      return await this.accountRepository.countForUser(id)
   }

   async upsertUserAccount(accountObject: NewAccount) {
      const accountEntity = new AccountEntity(accountObject)
      return await this.accountRepository.save(accountEntity)
   }

   async deleteUserAccount(id: number) {
      await this.accountRepository.removeBy('id', id)
   }
}