<script setup lang="ts">
const stages: {
   title: string
   image: string
   text: string[]
}[] = [
      {
         title: 'I ЭТАП: СБОР ИНФОРМАЦИИ',
         image: '/img/stages/stage1.webp',
         text: [
            'знакомство',
            'анкетирование',
            'консультация со специалистом',
            'консультация с художником или геральдистом',
            'анализ пожеланий',
         ]
      },
      {
         title: 'II ЭТАП: ЭСКИЗИРОВАНИЕ',
         image: '/img/stages/stage2.webp',
         text: [
            'Разработка не менее двух вариантов эскизов герба на выбор заказчика',
            'корректировки. Доработка и утверждение окончательного варианта эскиза',
            'составление описания символов с точки зрения значения в геральдике',
         ]
      },
      {
         title: 'III ЭТАП: ЗАВЕРШАЮЩИЙ',
         image: '/img/stages/stage3.webp',
         text: [
            'отрисовка окончательного варианта герба',
            'изготовление оригинал-макета',
            'составление полного геральдического (семантического) описания герба',
            'Блазонирование и регистрация',
            'изготовление дополнительных элементов, согласно категории сложности герба',
         ]
      },
      {
         title: 'IV ЭТАП: Дополнительные услуги',
         image: '/img/stages/stage4.webp',
         text: [
            'Предложения от Геральдической мастерской по изготовлению изделий с изображением герба',
            'Составление дизайн-проекта по применению герба в личной, деловой жизни',
            'Согласование сроков и этапов производства',
            'Изготовление презентационных материалов',
            'Изготовление изделий с гербом',
            'Сдача и отправка изделий в любую точку мира.',
         ]
      }
   ]
</script>

<template>
   <div class="grid grid-cols-2 gap-6 *:shadow-secondary *:first:bg-primary-100 *:last:bg-primary-100">
      <div v-for="stage in stages" :key="stage.title" class="grid grid-cols-[8fr_10fr] gap-4 items-center p-4">
         <img class="opacity-30" :src="stage.image" alt="">

         <div>
            <p class="uppercase font-semibold text-lg text-accent-800">{{ stage.title }}</p>

            <ul class="mt-5 pl-7 list-disc grid gap-1.5">
               <li v-for="item in stage.text" :key="item">
                  {{ item }}
               </li>
            </ul>
         </div>
      </div>
   </div>
</template>

<style scoped></style>