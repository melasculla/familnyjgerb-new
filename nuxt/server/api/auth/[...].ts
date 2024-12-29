import Google from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'

const config = useRuntimeConfig()
const admins = config.adminEmails.split(', ')
const uidTemplate = (provider: string, uid: string) => `${provider}-${uid}`

export default NuxtAuthHandler({
   secret: config.auth.secret,
   // theme: {
   //    brandColor: '#0080FF',
   //    logo: '/logo.webp'
   // },
   providers: [
      // @ts-expect-error Use .default here for it to work during SSR.
      Google.default({
         clientId: config.auth.providers.google.client,
         clientSecret: config.auth.providers.google.secret
      }),
   ],
   session: {
      maxAge: 60 * 60 * 24 * 7, // 7 days
   },
   callbacks: {
      signIn: async ({ user, profile, account }) => {
         if (!profile || !(user.email || profile.email) || !account)
            return false

         const userService = new UserService()

         let isUserExists: boolean = false
         const customUID = uidTemplate(account.provider, account.providerAccountId)
         try {
            isUserExists = await userService.getUserBy('uid', customUID) ? true : false
         } catch (err: any) { }

         if (!isUserExists) {
            try {
               await userService.upsertUser({
                  uid: customUID,
                  name: user.name ?? profile.name ?? '',
                  email: user.email ?? profile.email!,
                  role: admins.includes(user.email || profile.email!) ? 'admin' : 'user'
               })
            } catch (err: any) {
               console.error(err)
               return false
            }
         }

         return true
      },
      jwt: async ({ token, account, user }) => {
         if (account && user)
            token.uid = uidTemplate(account.provider, account.providerAccountId);

         if (token.uid && !token.role) {
            const user = await new UserService().getUserBy('uid', token.uid)
            token.role = user?.role
         }

         return token
      },
      session: async ({ session, token }) => {
         session.role = token.role ?? 'user'
         if (!session.uid)
            session.uid = token.uid

         return session
      }
   }
})