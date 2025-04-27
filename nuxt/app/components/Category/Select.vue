<script setup lang="ts">
const { anchors } = defineProps<{
   title: string
   description: string
   anchors?: {
      standard: string
      premium: string
      elite: string
   }
}>()

const categories = [
   { anchor: anchors?.standard, title: 'стандарт' },
   { anchor: anchors?.premium, title: 'премиум' },
   { anchor: anchors?.elite, title: 'элит' },
]
</script>

<template>
   <div class="shadow-secondary relative py-10">
      <NuxtImg class="absolute inset-0 size-full object-cover -z-[1] opacity-55" src="/img/main.webp" alt="" />

      <div
         class="relative py-5 text-white text-center after:absolute after:inset-0 after:-z-[1] after:bg-accent-800/90 after:mix-blend-multiply">
         <p class="text-xl uppercase font-semibold">{{ title }}</p>

         <Line class="mt-2 mb-3" icon="main" color="gradient-gold" size="small" />

         <p class="font-bold">{{ description }}</p>
      </div>

      <div
         class="relative mt-7 py-5 text-white text-center after:absolute after:inset-0 after:-z-[1] after:bg-accent-800/90 after:mix-blend-multiply">
         <div class="flex justify-center items-center gap-14">
            <a v-for="item in categories" :key="item.title" class="flex items-center gap-2 group"
               :href="item.anchor && `#${item.anchor}`">
               <svg class="h-8" viewBox="0 0 27 33" fill="none">
                  <path class="group-hover:fill-[url(#paint0_linear_395_26377)] transition-colors"
                     d="M25.6468 15.1865C25.3484 14.5762 24.9221 14.0393 24.3978 13.6131C23.8734 13.1868 23.2635 12.8816 22.6106 12.7187C21.9578 12.5558 21.2777 12.539 20.6178 12.6697C19.9579 12.8004 19.3341 13.0753 18.79 13.4752C17.3728 14.4689 16.3645 16.1359 15.6668 17.7036C14.9734 19.2127 14.6019 20.8529 14.5767 22.5172C14.571 21.0127 14.6987 19.5107 14.9582 18.0293C15.2253 16.3733 15.6123 14.7173 15.9666 13.0612C16.5116 10.4116 17.9451 6.98913 16.7678 4.31189C16.19 2.9981 14.6584 1.0771 13.2086 0.536133C11.6933 0.94462 10.0254 3.01466 9.39317 4.4002C8.22129 7.06089 9.63298 10.4723 10.1998 13.144C10.5487 14.8001 10.9357 16.4561 11.2082 18.1121C11.4662 19.5695 11.5921 21.0476 11.5843 22.5282C11.5498 20.8899 11.1786 19.2768 10.4942 17.792C9.79649 16.2243 8.7936 14.5627 7.37645 13.558C6.83147 13.1582 6.20696 12.8836 5.54643 12.7533C4.88589 12.623 4.20524 12.6402 3.55193 12.8036C2.89862 12.967 2.28837 13.2728 1.76372 13.6996C1.23907 14.1264 0.812624 14.664 0.514157 15.2748C-0.892091 18.1066 1.3808 20.4085 3.7845 21.7112C3.7191 19.5308 4.12245 18.4378 6.35174 18.6917C7.28094 18.8182 8.13475 19.2773 8.75862 19.9861C9.38249 20.6949 9.7352 21.6065 9.75289 22.5558H8.25944C7.97032 22.5558 7.69306 22.6721 7.48863 22.8792C7.28419 23.0862 7.16932 23.367 7.16932 23.6598C7.16932 23.9526 7.28419 24.2334 7.48863 24.4405C7.69306 24.6475 7.97032 24.7638 8.25944 24.7638H11.4262C11.2495 25.8661 10.9077 26.9346 10.4124 27.9324C9.93277 28.8929 8.59739 31.1506 7.49092 31.4211C9.1806 32.2657 11.0011 30.6648 11.7642 29.2848C11.6388 30.2067 12.0258 32.1 12.9197 32.5361H13.1105C14.1243 32.2656 14.5603 30.1956 14.435 29.2241C15.1926 30.6096 17.0076 32.216 18.7082 31.3659C17.6181 31.0899 16.2554 28.8432 15.7867 27.8772C15.3067 26.9012 14.9689 25.86 14.7838 24.7859H17.907C18.1961 24.7859 18.4733 24.6696 18.6778 24.4626C18.8822 24.2555 18.9971 23.9747 18.9971 23.6819C18.9971 23.3891 18.8822 23.1083 18.6778 22.9012C18.4733 22.6942 18.1961 22.5779 17.907 22.5779H16.4462C16.4486 21.6198 16.7941 20.6951 17.4185 19.9754C18.043 19.2556 18.904 18.7897 19.8419 18.6641C22.0712 18.4102 22.48 19.5032 22.4146 21.6781C24.7856 20.3257 27.0585 18.0238 25.6468 15.1865Z"
                     fill="currentColor" />
                  <defs>
                     <linearGradient id="paint0_linear_395_26377" x1="13.082" y1="0.536133" x2="13.082" y2="32.5361"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FCC469" />
                        <stop offset="0.165" stop-color="#F7B708" />
                        <stop offset="0.305" stop-color="#BD7A17" />
                        <stop offset="0.58" stop-color="#D6983D" />
                        <stop offset="0.825" stop-color="#B66D25" />
                        <stop offset="1" stop-color="#B17D0C" />
                     </linearGradient>
                  </defs>
               </svg>

               <p
                  class="uppercase font-semibold group-hover:bg-clip-text group-hover:text-transparent group-hover:gradient-gold">
                  {{ item.title }}
               </p>
            </a>
         </div>
      </div>

      <div class="mt-7">
         <ButtonsMain class="mx-auto">
            Заказать
         </ButtonsMain>
      </div>
   </div>
</template>

<style scoped></style>