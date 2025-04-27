<script setup lang="ts">
const text = [
   'Участие будущего владельца в процессе разработки его символа. Сам по себе ход работы очень увлекательный. Это позволит будущему армигеру лучше прочувствовать свой символ, узнать историю его зарождения.',
   'Не ограниченность выбора даря подарочный сертификат, Вы даете возможность почувствовать что человеку хочется сделать больше.',
   'Интересный дизайн и необычный подарок. Начало новой истории, на первый взгляд что то неизвестное, но таинственное.',
   'Решение на любой бюджет.',
]
</script>

<template>
   <div class="grid grid-cols-[4fr_5fr] bg-accent-2-950 text-white">
      <NuxtImg class="h-full" src="/img/certificate.webp" alt="" />

      <div class="py-5 px-6 grid gap-6 self-center">
         <div class="text-center">
            <p class="text-xl uppercase font-semibold mb-2">подарочный сертификат</p>

            <Line icon="stars" color="gradient-gold" full size="small" />
         </div>

         <div v-for="item, i in text" :key="item" class="flex items-center gap-4" :class="{ 'font-bold': i }">
            <IconsLily2Gold class="size-8 shrink-0" />

            <p>{{ item }}</p>
         </div>

         <ButtonsMain class="text-white border-white justify-self-center mt-10">
            Купить сертификат
         </ButtonsMain>
      </div>
   </div>
</template>

<style scoped></style>