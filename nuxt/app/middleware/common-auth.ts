export default defineNuxtRouteMiddleware(async (to, from) => {
   const { status } = useAuth()

   if (status.value === 'unauthenticated')
      return await navigateTo(`/api/auth/signin?callbackUrl=${encodeURIComponent(to.fullPath)}`)
})