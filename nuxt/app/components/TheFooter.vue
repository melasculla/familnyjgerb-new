<script setup lang="ts">
const { locale } = useI18n()
const localPath = useLocalePath()

const showCopyright = ref<boolean>(false)

const { data: posts, status: statusPosts } = await useLazyFetch<{ posts: PostList, total?: number }>(routesList.api.posts.getAll, {
   query: {
      locale: locale,
      perPage: 3,
      page: 1,
   },
   key: `${locale.value}:blog_posts:latest`,
   getCachedData: (key, nuxtApp) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      // const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      // if (!data)
      //    return

      // if (!data.lastFetch) {
      //    data.lastFetch = new Date()
      // } else {
      //    const now = new Date()
      //    const lastFetchDate = new Date(data.lastFetch)
      //    const diffInMs = now.getTime() - lastFetchDate.getTime()
      //    const diffInHours = diffInMs / (1000 * 60 * 60)

      //    if (diffInHours >= 5)
      //       return
      // }

      // return data
   },
})

const { data: categories, status: statusCategories } = await useLazyFetch(routesList.api.categories.getAll, {
   getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
   key: 'categories'
})
</script>

<template>
   <div class="px-10 py-7 bg-primary-400">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7 [&_.title]:text-lg [&_.title]:font-medium [&>div]:grid [&>div]:content-start [&>div]:gap-4
         [&_.items>*]:py-2 [&_.items>*:first-child]:pt-0 [&_.items>*:last-child]:pb-0 [&_.items>*:hover]:underline">
         <div>
            <p class="text-sm leading-5">Геральдическая мастерская «Традиции Времён» в своей работе в обязательном
               порядке учитывает все правила
               геральдики как науки, разрабатывает персональные гербы в строгом соответствии со всеми требованиями и
               канонами, используя консультации мэтров и специалистов, сертифицированных на государственном и
               международном уровнях</p>
            <NuxtLink :to="localPath('/')">
               <NuxtImg class="w-10/12 mx-auto" src="/logo.png" alt="Heraldry Workshop logo" width="380"
                  format="webp" />
            </NuxtLink>
         </div>

         <div class="text-center lg:order-1">
            <p class="title">Наши контакты</p>
            <div class="grid gap-2">
               <GlobalPhone class="justify-center" />
               <a :href="`tel:${$config.public.mail}`">{{ $config.public.mail }}</a>
            </div>
         </div>

         <div>
            <p class="title">Наши услуги</p>
            <div class="items grid gap-1 justify-items-start">
               <NuxtLink :to="localPath(routesList.client.static.services.gerbs)">Разработка фамильного герба</NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.korp_gerbs)">Разработка корпоративного герба
               </NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.ter_gerbs)">Разработка территориальной
                  геральдики
               </NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.monograms)">Разработка монограмм</NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.wedding_monograms)">Разработка свадебных
                  монограмм
               </NuxtLink>
               <NuxtLink class="text-balance" :to="localPath(routesList.client.static.souvenirs)">Применение символов.
                  Сувениры.
                  Подарки</NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.graphic)">Геральдическая графика</NuxtLink>
               <NuxtLink :to="localPath(routesList.client.posts.single('geraldicheskoe-opisanie-gerba.html'))">Описание
                  герба
               </NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.gerb_restore)">Восстановление герба</NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.noble_restore)">Восстановление дворянства
               </NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.cert)">Сертификат геральдической мастерской</NuxtLink>
               <NuxtLink :to="localPath(routesList.client.static.services.tree)">Родовое древо</NuxtLink>
            </div>
         </div>

         <div>
            <p class="title">
               <NuxtLink :to="localPath(routesList.client.posts.list)">Блог о геральдике</NuxtLink>
            </p>
            <div class="items grid gap-1 justify-items-start">
               <NuxtLink v-for="category in categories" :key="category.id" v-if="categories"
                  :to="localPath(routesList.client.posts.category(category.slug))">
                  {{ category[`name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof Category] ||
                     category.nameRu }}
               </NuxtLink>
               <div v-for="category in 5" :key="category" v-else-if="statusCategories === 'pending'" class="w-full">
                  <div class="h-6 w-full bg-primary-200 animate-pulse"></div>
               </div>
            </div>
            <p class="title">Свежие записи</p>
            <div class="items grid gap-1 justify-items-start">
               <NuxtLink v-for="post in posts?.posts" :key="post.id"
                  :to="localPath(routesList.client.posts.single(post.slug))" v-if="posts">
                  {{ post.title }}
               </NuxtLink>
               <div v-for="post in 4" :key="post" v-else-if="statusPosts === 'pending'" class="w-full">
                  <div class="h-10 w-full bg-primary-200 animate-pulse"></div>
               </div>
            </div>
         </div>
      </div>

      <div>
         <p class="mb-4">Copyright 2013 - {{ new Date().getFullYear() }} Геральдическая мастерская «Традиции Времён»</p>
         <p class="text-xs mb-2">Все материалы данного сайта являются объектами авторского права (в том числе дизайн).
            Запрещается
            копирование, распространение (в том числе путем копирования на другие сайты и ресурсы в Интернете) или любое
            иное использование информации и объектов без предварительного согласия правообладателя.</p>
         <p @click="showCopyright = !showCopyright" class="cursor-pointer hover:underline">© Прочитать весь копирайт</p>
         <div class="sr-only">
            <p>
               Все материалы данного сайта являются объектами авторского права, включая дизайн и оформление.
               Запрещается
               копирование, распространение (в том числе путем копирования на другие сайты и ресурсы в
               Интернете)
               или
               любое
               иное использование информации и объектов без предварительного согласия правообладателя.
            </p>
            <p>
               Также запрещается включение содержания страниц данного сайта и иных объектов, расположенных на
               сервере
               familnyiygerb.com, в структуру других сайтов (например, путем iframe или проставления прямых
               ссылок
               на
               объекты,
               в том числе фотографии).
            </p>
            <p>
               Запрещаются любые иные действия, в результате которых у пользователей Интернета может сложиться
               впечатление,
               что представленные материалы не имеют отношения к домену familnyiygerb.com.
            </p>
            <p>
               Размещать ссылку на страницу сайта можно в случае, если название ссылки соответсвует названию
               страницы,
               на
               которую ссылка должна привести (title) - внизу каждой страницы приведены коды ссылок.
            </p>
         </div>
      </div>

      <Teleport to="#teleports">
         <transition name="footer_copyright">
            <div v-if="showCopyright"
               class="fixed inset-0 w-full h-full z-10 backdrop-blur-sm flex items-center justify-center modal__window"
               @click.self="showCopyright = !showCopyright">
               <div class="grid gap-6 bg-primary-100 max-w-[75%] text-center p-10 text-lg shadow-lg modal__body">
                  <p>
                     Все материалы данного сайта являются объектами авторского права, включая дизайн и оформление.
                     Запрещается
                     копирование, распространение (в том числе путем копирования на другие сайты и ресурсы в
                     Интернете)
                     или
                     любое
                     иное использование информации и объектов без предварительного согласия правообладателя.
                  </p>
                  <p>
                     Также запрещается включение содержания страниц данного сайта и иных объектов, расположенных на
                     сервере
                     familnyiygerb.com, в структуру других сайтов (например, путем iframe или проставления прямых
                     ссылок
                     на
                     объекты,
                     в том числе фотографии).
                  </p>
                  <p>
                     Запрещаются любые иные действия, в результате которых у пользователей Интернета может сложиться
                     впечатление,
                     что представленные материалы не имеют отношения к домену familnyiygerb.com.
                  </p>
                  <p>
                     Размещать ссылку на страницу сайта можно в случае, если название ссылки соответсвует названию
                     страницы,
                     на
                     которую ссылка должна привести (title) - внизу каждой страницы приведены коды ссылок.
                  </p>
               </div>
            </div>
         </transition>
      </Teleport>
   </div>
</template>

<style scoped>
.footer_copyright-enter-active,
.footer_copyright-leave-active {
   transition: all 500ms;

   & .modal__body {
      transition: all 500ms;
   }
}

.footer_copyright-enter-from,
.footer_copyright-leave-to {
   opacity: 0;

   & .modal__body {
      translate: 0 -100vh;
   }
}
</style>