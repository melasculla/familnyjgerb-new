export class UserEntity {
   public id
   public name
   public email
   public uid
   public role
   public nickname
   public location
   public website

   constructor(userEntity: NewUser) {
      this.id = userEntity.id || null
      this.name = userEntity.name
      this.email = userEntity.email
      this.uid = userEntity.uid
      this.role = userEntity.role || 'user'
      this.nickname = userEntity.nickname || null
      this.location = userEntity.location || null
      this.website = userEntity.website || null
   }
}