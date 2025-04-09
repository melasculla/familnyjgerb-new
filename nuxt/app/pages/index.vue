<script setup lang="ts">
const carouselConfig: MyCarouselConfig = {
   itemsToShow: 1,
   // wrapAround: true,
   autoplay: 4000
}

const carouselServicesConfig: MyCarouselConfig = {
   itemsToShow: 4,
   // wrapAround: true,
   snapAlign: 'start',
   gap: 32,
   autoplay: 4000
}

const carouselShowcaseConfig: MyCarouselConfig = {
   itemsToShow: 5,
   // wrapAround: true,
   snapAlign: 'start',
   gap: 32,
   autoplay: 4000
}

const readMore = ref<boolean>(false)
const toggleMore = () => {
   readMore.value = !readMore.value

   // if (readMore.value)
   // nextTick(() => document.querySelector('.read__more p:last-child')?.scrollIntoView({ behavior: 'smooth' }))
}
</script>

<template>
   <div>
      <!-- <pre class="mt-[80rem]">{{ routesList.client.static }}</pre> -->
      <div class="grid grid-cols-[5fr_3fr] items-center overflow-hidden">
         <TheSlider :config="carouselConfig" :data="8" v-slot="{ description, index }">
            <div
               class="carousel__item w-full h-[38rem] bg-primary-500 flex items-center justify-center text-6xl text-primary-100">
               {{ index }}
            </div>
         </TheSlider>

         <div class="grid gap-8">
            <h2 class="uppercase text-3xl text-balance text-center font-light">
               ДОБРО ПОЖАЛОВАТЬ В <span class="text-accent-800 font-medium">МИР НАСЛЕДИЯ</span>
               И <span class="text-accent-800 font-medium">ПРЕСТИЖА</span>
            </h2>

            <p class="text-center text-lg text-balance">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
               Consequuntur, commodi?</p>

            <ButtonsMain class="mx-auto">
               Получить консультацию
            </ButtonsMain>
         </div>
      </div>

      <div class="mx-auto w-10/12 text-center border-2 border-primary-300 p-12">
         <p class="text-balance text-3xl uppercase font-light">ВЫ ЗДЕСЬ ПОТОМУ ЧТО ИЩИТЕ НЕЧТО ОСОБЕННОЕ?</p>
         <p class="text-balance text-lg mt-3">Вы в правильном месте, так как тут создаються уникальные символы,
            наполненные
            особым смыслом!
         </p>
      </div>

      <div class="overflow-hidden">
         <p class="text-3xl mb-7 text-center font-medium uppercase text-accent-800">Наши Услуги:</p>
         <!-- @vue-skip -->
         <TheSlider :config="carouselServicesConfig" v-slot="{ description, index, path, sub }" nav :data="[
            { path: '/img/services/1.webp', sub: '/img/services/1.1.webp' },
            { path: '/img/services/2.webp', sub: '/img/services/2.1.webp' },
            { path: '/img/services/3.webp', sub: '/img/services/3.1.webp' },
            { path: '/img/services/4.webp' },
            { path: '/img/services/1.webp', sub: '/img/services/1.1.webp' },
            { path: '/img/services/2.webp', sub: '/img/services/2.1.webp' },
            { path: '/img/services/3.webp', sub: '/img/services/3.1.webp' },
            { path: '/img/services/4.webp' },
         ]">
            <div class="relative carousel__item w-full flex items-center justify-center text-6xl text-primary-100">
               <NuxtImg :src="path" alt="" />

               <NuxtImg v-if="sub" class="h-[20rem] absolute bottom-4 left-1/2 -translate-x-1/2" :src="sub" alt="" />
            </div>
         </TheSlider>
      </div>

      <div class="overflow-hidden">
         <p class="text-2xl text-center text-balance font-medium">
            ПЕРСОНАЛЬНЫЙ СИМВОЛ <span class="text-accent-800">(ГЕРБ, МОНОГРАММА, ЭМБЛЕМА)</span> - ЭТО ВОЗМОЖНОСТЬ
            РАЗВИТЬ ПЕРСОНАЛЬНЫЙ СТИЛЬ,
            КАК В СОВРЕМЕННЫХ ТРАДИЦИЯХ, ТАК И В ТРАДИЦИЯХ ПРОШЛОГО
         </p>
         <TheSlider class="my-7" :config="carouselShowcaseConfig" :data="12" v-slot="{ description, index }" nav>
            <div
               class="image w-full flex items-center justify-center aspect-square bg-primary-500 text-6xl text-primary-100">
               {{ index }}
            </div>
            <p>{{ description || 'description' }}</p>
         </TheSlider>
         <ButtonsMain class="mx-auto" :href="routesList.client.gallery.gerbs">
            Перейти в портфолио
         </ButtonsMain>
      </div>

      <div>
         <div class="relative">
            <img src="https://familnyjgerb.com/wp-content/themes/alf_geraldika/new/images/banner.jpg"
               class="image w-full bg-slate-500 absolute inset-0 h-full object-cover" />
            <div class="w-max lg:max-w-[45%] grid gap-5 min-h-[35rem] p-20 text-lg relative z-[2] bg-primary-100/90">
               <h3 class="text-3xl uppercase font-medium">МЫ СОЗДАЕМ ГЕРБЫ ДЛЯ:</h3>
               <div>
                  <p class="font-medium text-3xl mb-1">Частных лиц</p>
                  <p class="text-accent-800 text-2xl">Фамильный герб (личный, родовой, семейный)</p>
               </div>
               <div>
                  <p class="mb-1">Вы получатете:</p>
                  <p>Основу для воспитания будущих поколений, послание потомкам и современникам</p>
                  <p>Начало Вашего персонального стиля, бренда Вашей семь и на многие поколения вперед</p>
               </div>
               <div>
                  <p class="font-medium text-3xl mb-1">Организаций</p>
                  <p class="text-accent-800 text-2xl">Корпоративный герб</p>
               </div>
               <div>
                  <p class="mb-1">Вы получатете:</p>
                  <p>Знак, который подчеркнет сильные стороны компании, ее преимущества, миссию, специфику бизнеса и
                     другие
                     отличительные черты</p>
                  <p>Повышение узнаваемости и популярности Вашей компании, Ваших услуг и товаров</p>
                  <p>Основу корпоративного стиля</p>
               </div>
            </div>
         </div>

         <ButtonsMain class="mt-5 mx-auto" :href="routesList.client.static.services.gerbs">
            Подробнее
         </ButtonsMain>
      </div>

      <div class="overflow-hidden">
         <TheSlider :config="carouselShowcaseConfig" :data="12" v-slot="{ description, index }" nav>
            <div
               class="image w-full flex items-center justify-center aspect-square bg-primary-500 text-6xl text-primary-100">
               {{ index }}
            </div>
            <p>{{ description || 'description' }}</p>
         </TheSlider>

         <ButtonsMain class="mt-7 mx-auto" :href="routesList.client.gallery.gerbs">
            Перейти в портфолио
         </ButtonsMain>
      </div>

      <div class="grid grid-cols-[5fr_3fr] items-center">
         <div>
            <ClientOnly>
               <video class="aspect-[16/7] w-full" controls poster="/loader.svg"
                  src="https://heraldry.art-studiott.com/main_ru.webm"></video>
            </ClientOnly>
         </div>

         <div class="grid gap-8">
            <h2 class="uppercase text-2xl text-balance text-center font-medium">
               Для того чтобы иметь свой Герб, необязательно принадлежать к определенному сословию или быть дворянином.
               Достаточно лишь желание!
            </h2>

            <ButtonsMain class="mx-auto">
               Получить консультацию
            </ButtonsMain>
         </div>
      </div>

      <div>
         <div class="relative flex">
            <img src="https://familnyjgerb.com/wp-content/themes/alf_geraldika/new/images/banner.jpg"
               class="image w-full bg-slate-500 absolute inset-0 h-full object-cover" />
            <div
               class="w-max lg:max-w-[45%] ml-auto grid gap-3 min-h-[35rem] p-20 text-lg relative z-[2] bg-primary-100/90">
               <h3 class="text-3xl uppercase font-medium">МЫ МОНОГРАММЫ ДЛЯ:</h3>
               <div>
                  <p class="font-medium text-3xl text-accent-800 mb-1">Личная Монограмма и Семейная Монограмма</p>
                  <p>- Демократичный, уникальный личный символ</p>
                  <p>- Высокохудожественная интерпретация Ваших инициалов</p>

                  <p>- Ваша личность, характер, натура в графике</p>
                  <p>- Основа персонального стиля (бренда)</p>

                  <p>- Традиция вашей семьи</p>
                  <p>- Отличительный знак</p>
                  <p>- Ценность, передаваемая детям</p>
               </div>

               <p class="mt-3 text-3xl text-accent-800 font-medium">Корпоративная Монограмма - Логотип</p>
            </div>
         </div>

         <ButtonsMain class="mt-5 mx-auto" :href="routesList.client.static.services.monograms">
            Подробнее
         </ButtonsMain>
      </div>

      <div class="overflow-hidden">
         <TheSlider :config="carouselShowcaseConfig" :data="12" v-slot="{ description, index }" nav>
            <div
               class="image w-full flex items-center justify-center aspect-square bg-primary-500 text-6xl text-primary-100">
               {{ index }}
            </div>
            <p>{{ description || 'description' }}</p>
         </TheSlider>

         <ButtonsMain class="mt-7 mx-auto" :href="routesList.client.gallery.monograms">
            Перейти в портфолио
         </ButtonsMain>
      </div>

      <div class="px-10">
         <p class="text-center text-3xl uppercase font-medium">Почему стоит заказать у нас?</p>
         <div class="mt-5 grid gap-12">
            <div class="flex justify-center gap-4 text-lg">
               <input id="why-us-gerbs" class="sr-only peer/gerbs" type="radio" name="why-us" checked>
               <input id="why-us-monograms" class="sr-only peer/monograms" type="radio" name="why-us">
               <input id="why-us-logotypes" class="sr-only peer/logotypes" type="radio" name="why-us">

               <label for="why-us-gerbs"
                  class="cursor-pointer peer-checked/gerbs:bg-primary-200 transition-colors uppercase border border-primary-900 px-5 py-2 select-none">
                  Гербы
               </label>
               <label for="why-us-monograms"
                  class="cursor-pointer peer-checked/monograms:bg-primary-200 transition-colors uppercase border border-primary-900 px-5 py-2 select-none">
                  Монограммы
               </label>
               <label for="why-us-logotypes"
                  class="cursor-pointer peer-checked/logotypes:bg-primary-200 transition-colors uppercase border border-primary-900 px-5 py-2 select-none">
                  Логотипы
               </label>
            </div>

            <div class="grid grid-cols-3 gap-4">
               <div class="transition-shadow p-6 flex flex-col gap-4 shadow-main hover:shadow-main-hover"
                  v-for="card in 3" :key="card">
                  <p class="text-xl">Lorem ipsum dolor sit amet consectetur</p>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod unde nostrum animi aspernatur,
                     temporibus
                     earum doloremque fugit dignissimos accusantium quibusdam!</p>
                  <p class="mt-auto pt-24 underline">Link</p>
               </div>
            </div>
         </div>
      </div>

      <div class="text-center mx-auto md:w-10/12 px-10">
         <p class="text-3xl font-medium uppercase">О нас</p>
         <p class="text-balance">
            Геральдическая Мастерская "Традиции Времён" является компанией №1 в Европе в сфере создания фамильной
            геральдики с таким профессионализмом и разнообразием
         </p>

         <button @click="toggleMore" class="mt-2 mb-7 decoration-dashed underline text-accent-500">
            читать далее
         </button>

         <transition name="read_more">
            <div class="read__more overflow-hidden grid gap-4" v-if="readMore">
               <p>
                  Идейным вдохновителем создания Геральдической Мастерской "Традиции Времён" стал учредитель компании,
                  который
                  увидел в данных символах особую глубину. Герб и монограмма – как символ, олицетворяющий все самое
                  ценное
                  для
                  человека, качества, характер, вкусы, взгляды, принципы, кредо, пожелание, послание будущим поколениям.
                  Все
                  это
                  передается через систему символов и запечатлеется на долгие годы, объединяя поколения, подчеркивая
                  статус
                  Владельца, его индивидуальность.
               </p>
               <p>
                  Мы создали особый институт личного бренда на основе персональной символики. Геральдическая Мастерская
                  «Традиции
                  Времён» является компанией №1 в Европе в сфере создания фамильной геральдики с таким подходом.
               </p>
               <p>
                  Мы разрабатываем не просто правильные с точки зрения геральдической традиции гербы, а делаем нечто
                  большее –
                  создаем осмысленные символы, отражающие характер, ценности, принципы, мировоззрение и стиль владельца.
                  Геральдическая мастерская «Традиции Времён» организовала нестандартный новаторский подход к каждому
                  проекту.
               </p>
               <p>
                  Отточенный годами опыт работы позволяет работать с разными людьми по социальному статусу, менталитету,
                  национальности, профессии, уровня финансового обеспечения.
               </p>
               <p>
                  Мы задаем тенденции современной геральдики. С нас берут пример дизайнеры и художники. Нам подражают
                  компании,
                  также занимающиеся в данной сфере. Нам доверяют частные лица, компании, муниципалитеты. Гербы и
                  монограммы,
                  разработанные Геральдической Мастерской «Традиции Времён» – уникальный авторский продукт.
               </p>
            </div>
         </transition>
      </div>

      <div>
         <p class="text-3xl text-center mb-7 font-medium uppercase">Сфера применения персональной символики</p>
         <TheSlider :config="carouselServicesConfig" :data="12" v-slot="{ description, index }" nav>
            <div
               class="image w-full flex items-center justify-center aspect-square bg-primary-500 text-6xl text-primary-100">
               {{ index }}
            </div>
            <p>{{ description || 'description' }}</p>
         </TheSlider>
      </div>

      <div class="text-center grid gap-7">
         <div>
            <p class="text-3xl font-medium uppercase">Есть вопросы?</p>
            <p class="text-lg">Оставьте заявку и наши специалисты в течении 15 минут Вам перезвонят</p>
         </div>

         <div class="grid grid-cols-3 gap-4 px-10">
            <input class="min-w-0 w-full px-3 py-2 rounded-tl-md rounded-br-md" type="text" placeholder="Input">
            <input class="min-w-0 w-full px-3 py-2 rounded-tl-md rounded-br-md" type="text" placeholder="Input">
            <input class="min-w-0 w-full px-3 py-2 rounded-tl-md rounded-br-md" type="text" placeholder="Input">
         </div>
      </div>
   </div>
</template>

<style scoped>
.read_more-enter-active,
.read_more-leave-active {
   transition: all 500ms;
   max-height: 70rem;
}

.read_more-leave-active {
   transition-duration: 300ms;
}

.read_more-enter-from,
.read_more-leave-to {
   max-height: 0;
}
</style>