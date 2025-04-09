import { getServerSession } from '#auth'
import type { HTTPMethod } from 'h3'
import type { NitroFetchRequest } from 'nitropack'

declare module 'h3' {
   interface H3EventContext {
      requestDTO: Record<any, any>
      role?: Roles
      uid?: string
      email?: string
   }
}

type Route = {
   path: NitroFetchRequest
   permissions: { roles?: Roles[], methods?: HTTPMethod[] }[]
}

const protectedRoutes: Route[] = [
   {
      path: '/api/admin',
      permissions: [
         { roles: ['admin'] }
      ]
   },
   {
      path: '/api/posts',
      permissions: [
         { methods: ['GET'] },
         { roles: ['admin'] }
      ]
   },
   {
      path: '/api/categories',
      permissions: [
         { methods: ['GET'] },
         { roles: ['admin'] }
      ]
   },
   {
      path: '/api/projects',
      permissions: [
         { methods: ['GET'] },
         // { methods: ['POST'], roles: ['editor'] },
         { roles: ['admin'] }
      ]
   },
   {
      path: '/api/gallery',
      permissions: [
         { methods: ['GET'] },
         { roles: ['admin'] }
      ]
   },
   {
      path: '/api/media',
      permissions: [
         { methods: ['GET'] },
         { roles: ['admin'] }
      ]
   },
]

export default defineEventHandler(async event => {
   event.context.requestDTO = {}

   const session = await getServerSession(event)
   event.context.role = session?.role
   event.context.uid = session?.uid
   event.context.email = session?.user?.email == null ? undefined : session.user.email

   const protectedRoute = protectedRoutes.find(({ path }) => event.path.startsWith(path as string))
   if (!protectedRoute)
      return

   let isAuthorized: boolean = false

   for (const permission of protectedRoute.permissions) {
      let allowedMethod: boolean = false
      let allowedRole: boolean = false

      if (permission.methods?.length)
         allowedMethod = permission.methods.includes(event.method)
      else
         allowedMethod = true

      if (permission.roles?.length)
         allowedRole = event.context.role ? permission.roles.includes(event.context.role) : false
      else
         allowedRole = true

      isAuthorized = allowedMethod && allowedRole
      if (isAuthorized)
         break
   }

   if (isAuthorized)
      return

   if (!session)
      throw createError(errorsList.unauthorized)

   throw createError(errorsList.forbidden)
})