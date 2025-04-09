<script setup lang="ts">

</script>

<template>
   <div class="text-base">
      <!-- TODO: make search -->
      <div class="grid grid-cols-[1fr_4fr_1fr] items-center px-4 pt-4">
         <div class="flex gap-12 items-center flex-wrap">
            <svg class="size-8" viewBox="0 0 24 24">
               <path fill="currentColor" fill-rule="evenodd"
                  d="M11.455 23h1.101l.994-1.242c1.306-1.632 2.881-3.725 4.137-5.891C18.904 13.767 20 11.305 20 9c0-4.605-3.395-8-8-8S4 4.395 4 9c0 2.293 1.063 4.755 2.271 6.867c1.245 2.177 2.82 4.276 4.177 5.916zM6 9c0 2.95 2.386 6.846 4.712 9.9c.41.54.83 1.047 1.225 1.524L12 20.5q.603-.755 1.247-1.611C15.553 15.823 18 11.949 18 9c0-3.5-2.5-6-6-6S6 5.5 6 9"
                  clip-rule="evenodd" />
               <circle cx="12" cy="9" r="1" fill="currentColor" />
               <path fill="currentColor" fill-rule="evenodd" d="M12 11a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
                  clip-rule="evenodd" />
            </svg>

            <GlobalPhone />
         </div>

         <div class="justify-self-center">
            <h1 class="text-3xl font-medium">Геральдическая мастерская «Традиции Времён»</h1>
         </div>

         <div class="flex justify-end flex-wrap">
            <a :href="`mailto:${$config.public.mail}`" target="_blank" class="flex gap-2 items-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor"
                     d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.3-1.075q-.725.725-1.638 1.088T12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12v1.45q0 .65.425 1.1T18.5 15t1.075-.45t.425-1.1V12q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20h5v2zm0-7q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15" />
               </svg>
               {{ $config.public.mail }}
            </a>
         </div>
      </div>
   </div>
</template>

<style scoped></style>