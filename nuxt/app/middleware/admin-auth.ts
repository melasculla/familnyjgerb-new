export default defineNuxtRouteMiddleware(async (to, from) => {
   const { status, data } = useAuth()

   if (status.value === 'unauthenticated' || data.value?.role !== 'admin')
      return await navigateTo(`/api/auth/signin?callbackUrl=${encodeURIComponent(to.fullPath)}`)
})