export default defineNuxtRouteMiddleware(async (to, from) => {
   const { status, data } = useAuth()

   if (status.value === 'unauthenticated' || data.value?.role !== 'admin')
      return await navigateTo(`/api/auth/signin?callbackUrl=${encodeURIComponent(to.fullPath)}`, { external: true })

   // const userState = useState<any | null>('auth:user', () => null)
   // if (to.meta.roles)
   //    return

   // if (!userState.value?.roles?.includes('ROLE_ADMIN'))
   //    return await navigateTo(`http://patrik.ml:8080/connect/google?_destanation=${encodeURIComponent(to.fullPath)}`, { external: true })
})