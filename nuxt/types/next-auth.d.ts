import 'next-auth'

declare module 'next-auth' {
   interface Profile {
      picture: string
   }

   interface Session {
      role: Roles,
      uid: string
   }
}

declare module 'next-auth/jwt' {
   interface DefaultJWT {
      role: Roles
      uid: string
   }
}