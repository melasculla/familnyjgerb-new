export class UserEntity {
   public id
   public email
   public name
   public role
   public uid

   constructor(userEntity: NewUser) {
      this.id = userEntity.id || null
      this.email = userEntity.email
      this.name = userEntity.name
      this.role = userEntity.role || 'user'
      this.uid = userEntity.uid
   }
}

export class AccountEntity {
   public id
   public userId
   public provider
   public providerAccountId

   constructor(accountEntity: NewAccount) {
      this.id = accountEntity.id || null
      this.userId = accountEntity.userId
      this.provider = accountEntity.provider
      this.providerAccountId = accountEntity.providerAccountId
   }
}