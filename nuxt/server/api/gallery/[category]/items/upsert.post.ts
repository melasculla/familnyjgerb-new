export default defineEventHandler({
   onRequest: [
      GalleryHandler.validateBody
   ],
   handler: async event => {
      try {
         // TODO: make re-ordering
         return await new GalleryItemService().upsertItems(10,
            [
               { id: 31, image: 'test55.jpg', title: 'test' },
               { id: 33, image: 'test5123.jpg', title: 'test' },
               { id: undefined, image: 'test_new.jpg', title: 'test', order: 10 },
               // { id: undefined, image: 'test3.jpg', title: 'test', order: 3 },
               // { id: undefined, image: 'test4.jpg', title: 'test', order: 4 },
               // { id: undefined, image: 'test5.jpg', title: 'test', order: 5 },
            ]
         )
      } catch (err: any) {
         console.log(err.message)
         if (err.message.includes('duplicate'))
            throw createError({ statusCode: 409, message: `Item with this order or source already exists` })

         throw createError({ statusCode: err.status, message: err.message })
      }
   }
})