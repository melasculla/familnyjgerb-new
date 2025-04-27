<script setup lang="ts">
defineProps<{
   title: string
   description: string
   images: { path: string, alt?: string }[]
   aspect: `${number}/${number}`
   reverse?: boolean
}>()
</script>

<template>
   <div class="grid gap-8 shadow-secondary bg-primary-100 px-8 py-12 scroll-m-20"
      :class="reverse ? 'grid-cols-[5fr_4fr]' : 'grid-cols-[4fr_5fr]'">
      <div class="self-start grid gap-12 content-start text-center sticky top-14" :class="{ 'order-1': reverse }">
         <div>
            <p class="text-2xl text-accent-800 font-semibold">
               {{ title }}:
            </p>

            <Line class="mt-2 mb-3" icon="main" size="small" />

            <p class="uppercase text-lg">
               {{ description }}
            </p>
         </div>

         <TheSlider :data="images" :config="{ itemsToShow: 1 }" v-slot="{ path, alt }" :aspect="aspect"
            :nav="{ type: 'static' }">
            <NuxtImg :src="path" :alt="alt" class="w-full" />
         </TheSlider>
      </div>

      <div
         class="self-start grid gap-4 [&_ol]:grid [&_ol]:gap-4 [&_ol]:list-decimal [&_ol]:list-inside content-start sticky top-14">
         <p><b>Описание категории:</b></p>

         <slot name="description" />

         <p v-if="$slots.details"><b>Подробнее</b></p>

         <slot name="details" />

         <p class="text-accent-800"><b>Результат работ:</b></p>

         <slot name="result" />

         <div class="flex items-center justify-evenly flex-wrap gap-4 px-4 mt-8">
            <ButtonsMain>
               Получить консультацию
            </ButtonsMain>

            <ButtonsMain>
               Перейти в портфолио
            </ButtonsMain>
         </div>
      </div>
   </div>
</template>

<style scoped></style>