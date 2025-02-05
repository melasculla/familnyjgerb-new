export default defineNuxtPlugin(async nuxtApp => {
   const userState = useState<any | null>('auth:user', () => null)
   if (userState.value)
      return

   const user = await useRequestFetch()('/api/me').catch(err => console.warn(err))
   userState.value = user
})