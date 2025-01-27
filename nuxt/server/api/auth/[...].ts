import Google from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'

const config = useRuntimeConfig()
const admins = config.adminEmails.split(', ')

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
      maxAge: 60 * 60 * 24 * 4, // 4 days
   },
   callbacks: {
      signIn: async ({ user, profile, account }) => {
         if (!profile || !(user.email || profile.email) || !account)
            return false

         const userService = new UserService()
         const email = user.email || profile.email!

         try {
            let existingUser = await userService.getUserBy('email', email)

            if (!existingUser)
               existingUser = await userService.upsertUser({
                  name: user.name || profile.name || '',
                  email,
                  role: admins.includes(email) ? 'admin' : 'user',
               })

            const existingAccount = await userService.getUserAccountBy('provider', { provider: account.provider, providerAccountId: account.providerAccountId })
            if (!existingAccount) {
               await userService.upsertUserAccount({
                  userId: existingUser.id!,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
               })
            }

            return true
         } catch (err) {
            console.error(err)
            return false
         }
      },
      jwt: async ({ token, account, user }) => {
         const userService = new UserService()

         if (account && user) {
            const foundedUser = await userService.getUserBy('email', user.email || token.email!)
            token.uid = foundedUser.uid!
         }

         if (token.uid && !token.role) {
            const user = await userService.getUserBy('uid', token.uid)
            token.role = user?.role
         }

         return token
      },
      session: async ({ session, token }) => {
         session.role = token.role || 'user'
         if (!session.uid)
            session.uid = token.uid

         return session
      }
   }
})