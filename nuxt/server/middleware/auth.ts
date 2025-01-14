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
   // {
   //    path: '/api/media',
   //    permissions: [
   //       { methods: ['GET'] },
   //       { roles: ['admin'] }
   //    ]
   // }
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
      if (permission.methods) {
         isAuthorized = permission.methods.includes(event.method)
         if (isAuthorized)
            break
      }

      if (permission.roles && permission.roles.includes(event.context.role!)) {
         isAuthorized = true
         break
      }
   }

   if (isAuthorized)
      return

   if (!session)
      throw createError(errorsList.unauthorized)

   throw createError(errorsList.forbidden)
})