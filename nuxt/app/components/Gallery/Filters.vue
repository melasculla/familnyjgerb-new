<script setup lang="ts">
import Tooltip from 'primevue/tooltip'

const directive = useNuxtApp().vueApp.directive
if (!directive('tooltip'))
   directive('tooltip', Tooltip)

const { t } = useI18n()
const route = useRoute()
const query = computed(() => route.query)

const { gallery } = defineProps<{
   gallery: 'gerbs' | 'monograms'
}>()

const category = computed<string[]>({
   get: () => convertQueryToStringArray(query.value.category),
   set: async newValue => navigateTo({ query: { ...query.value, page: 1, category: newValue.length ? newValue.join(',') : undefined }, replace: true })
})
const type = computed<string[]>({
   get: () => convertQueryToStringArray(query.value.type),
   set: async newValue => navigateTo({ query: { ...query.value, page: 1, type: newValue.length ? newValue.join(',') : undefined }, replace: true })
})
const usage = computed<string[]>({
   get: () => convertQueryToStringArray(query.value.usage),
   set: async newValue => navigateTo({ query: { ...query.value, page: 1, usage: newValue.length ? newValue.join(',') : undefined }, replace: true })
})
const info = computed<string[]>({
   get: () => convertQueryToStringArray(query.value.info),
   set: async newValue => navigateTo({ query: { ...query.value, page: 1, info: newValue.length ? newValue.join(',') : undefined }, replace: true })
})

const categoryOptions = {
   standard: GALLERY_ENUM.category.standard,
   premium: GALLERY_ENUM.category.premium,
   elite: GALLERY_ENUM.category.elite,
   ...(gallery === 'monograms' && {
      individual: GALLERY_ENUM.category.individual
   })
}

const translateObject = (object: Record<any, any>, i18nKey: string, number: boolean = true) => Object.entries(object).reduce((acc, [key]) => {
   acc[number ? Number(key) : key] = t(`${i18nKey}.${key}`)
   return acc
}, {} as Record<string | number, string>)


const activeFilters = computed(() => {
   return [
      ...category.value.map(item => ({
         id: item,
         type: 'category',
         label: t(`gallery.enum.category.${item}`)
      })),
      ...type.value.map(item => ({
         id: item,
         type: 'type',
         label: t(`gallery.enum.type.${item}`)
      })),
      ...usage.value.map(item => ({
         id: item,
         type: 'usage',
         label: t(`gallery.enum.usage.${item}`)
      })),
      ...info.value.map(item => ({
         id: item,
         type: 'info',
         label: t(`gallery.enum.info.${item}`)
      })),
   ]
})

const removeFilter = (_type: string, key: string) => {
   if (_type === 'category')
      category.value = category.value.filter(item => item !== key)
   else if (_type === 'type')
      type.value = type.value.filter(item => item !== key)
   else if (_type === 'usage')
      usage.value = usage.value.filter(item => item !== key)
   else if (_type === 'info')
      info.value = info.value.filter(item => item !== key)
}
</script>

<template>
   <PrimeScrollPanel class="w-full [&_.p-scrollpanel-bar.p-scrollpanel-bar-x]:opacity-0!" :dt="{
      // [&_.p-scrollpanel-bar.p-scrollpanel-bar-y]:opacity-100!
      // transition: {
      //    duration: ''
      // },
      bar: {
         background: 'var(--color-accent-800)',
         size: '8px',
         border: {
            radius: '4px'
         },
         // focus: {
         //    ring: {
         //       width: '',
         //       style: '',
         //       color: '',
         //       offset: '',
         //       shadow: '',
         //    }
         // }
      }
   }">
      <div class="grid gap-12 content-start font-medium pb-5 pr-4">
         <transition-group name="filters">
            <div v-if="activeFilters.length" class="flex gap-2 flex-wrap" key="0">
               <div class="grow flex justify-between items-center gap-2 text-base mb-2">
                  <p class="font-bold">
                     {{ t('gallery.main.apply') }}:
                  </p>

                  <button class="flex items-center gap-2 font-normal cursor-pointer"
                     @click="navigateTo({ query: { page: query.page } })">
                     <span>{{ t('gallery.main.clear') }}</span>

                     <svg class="shrink-0 size-4" viewBox="0 0 14 14" fill="none">
                        <path
                           d="M12.7224 14L7 8.26864L1.27763 14L0 12.7224L5.73136 7L0 1.27763L1.27763 0L7 5.73136L12.7224 0.00899763L13.991 1.27763L8.26864 7L13.991 12.7224L12.7224 14Z"
                           fill="currentColor" />
                     </svg>
                  </button>
               </div>

               <transition-group name="filters">
                  <div v-for="item in activeFilters" :key="item.label" @click="removeFilter(item.type, item.id)" class="flex items-center gap-2 bg-accent-800
                  text-white px-3 py-1.5 text-base cursor-pointer hover:bg-primary-500 transition-all">
                     <span class="font-bold">{{ item.label }}</span>

                     <svg class="shrink-0 size-4" viewBox="0 0 14 14" fill="none">
                        <path
                           d="M12.7224 14L7 8.26864L1.27763 14L0 12.7224L5.73136 7L0 1.27763L1.27763 0L7 5.73136L12.7224 0.00899763L13.991 1.27763L8.26864 7L13.991 12.7224L12.7224 14Z"
                           fill="white" />
                     </svg>
                  </div>
               </transition-group>
            </div>

            <GalleryFilter name="category" v-model="category"
               :options="translateObject(categoryOptions, 'gallery.enum.category', false)" key="1">
               {{ $t('gallery.titles.category') }}
            </GalleryFilter>

            <GalleryFilter name="type" v-model="type" :options="translateObject(GALLERY_ENUM.type, 'gallery.enum.type')"
               key="2">
               {{ $t(`gallery.titles.type.${gallery}`) }}
            </GalleryFilter>

            <GalleryFilter name="usage" v-model="usage"
               :options="translateObject(GALLERY_ENUM.usage, 'gallery.enum.usage')" key="3">
               {{ $t('gallery.titles.usage') }}
            </GalleryFilter>

            <GalleryFilter name="info" v-model="info" :options="translateObject(GALLERY_ENUM.info, 'gallery.enum.info')"
               key="4">
               {{ $t('gallery.titles.info') }}
            </GalleryFilter>

            <NuxtLink class="w-full flex items-center justify-center gap-4 font-semibold text-center px-6 py-1.5 border border-neutral
               text-neutral/50 justify-self-center text-basic-900/50 hover:text-basic-900
               transition-colors" :to="{ query: { page: query.page } }" key="5">
               <span>{{ $t('gallery.main.reset') }}</span>

               <svg class="size-6" viewBox="0 0 14 14" fill="none">
                  <path
                     d="M12.7305 14L7.0045 8.26864L1.27846 14L0 12.7224L5.73505 7L0 1.27763L1.27846 0L7.0045 5.73136L12.7305 0.00899763L14 1.27763L8.27396 7L14 12.7224L12.7305 14Z"
                     fill="currentColor" fill-opacity="0.5" />
               </svg>
            </NuxtLink>
         </transition-group>
      </div>
   </PrimeScrollPanel>
</template>

<style scoped>
.filters-move,
.filters-enter-active,
.filters-leave-active {
   transition: all 500ms;
   position: relative;
}

.filters-leave-active {
   width: 100%;
   position: absolute;
}

.filters-enter-from,
.filters-leave-to {
   opacity: 0;
}
</style>