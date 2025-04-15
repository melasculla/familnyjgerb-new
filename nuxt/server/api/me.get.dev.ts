export default defineEventHandler({
   onRequest: [],
   handler: async event => {
      const authCookie = getCookie(event, 'auth_token')
      const user = await $fetch<{ data: any }>('http://patrik.ml:8080/api/auth/verify', {
         headers: [
            ['Authorization', `Bearer ${authCookie}`]
         ]
      }).catch(err => console.warn(err))

      return user?.data || {}
   }
})