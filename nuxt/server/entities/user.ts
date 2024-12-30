export class UserEntity {
   public id
   public name
   public email
   public uid
   public role

   constructor(userEntity: NewUser) {
      this.id = userEntity.id || null
      this.name = userEntity.name
      this.email = userEntity.email
      this.uid = userEntity.uid
      this.role = userEntity.role || 'user'
   }
}