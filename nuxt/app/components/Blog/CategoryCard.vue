<script setup lang="ts">
import slugify from '@sindresorhus/slugify'

const emit = defineEmits<{
   'delete': [id?: number]
}>()

const { category } = defineProps<{
   category?: NewCategory
}>()

const data = ref<NewCategory | null>(category ? deepClone(category) : null)

const categoryEntity = reactive<NewCategory>({
   id: category?.id || undefined,
   slug: category?.slug || '',
   nameRu: category?.nameRu || '',
   nameEn: category?.nameEn || null,
})

const editing = useState<number | null>('admin:category:editing', () => null)
const hasBeenEdited = computed<boolean>(() => JSON.stringify(data.value) !== JSON.stringify(categoryEntity))
const editable = computed<boolean>(() => editing.value === categoryEntity.id || !categoryEntity.id)

const ruId = useId()
const enId = useId()

const save = async () => {
   if (!categoryEntity.slug && !categoryEntity.slug.length) {
      if (categoryEntity.nameRu)
         categoryEntity.slug = slugify(categoryEntity.nameRu)
      else if (categoryEntity.nameEn)
         categoryEntity.slug = slugify(categoryEntity.nameEn)
   }

   const result = await $fetch<{ category: Category }>(categoryEntity.id ? routesList.api.categories.edit : routesList.api.categories.create, {
      method: categoryEntity.id ? 'PATCH' : 'POST',
      body: categoryEntity
   }).catch(err => console.warn(err))

   if (!result)
      return

   data.value = result.category
   Object.assign(categoryEntity, result.category)
}
</script>

<template>
   <div>
      <div class="relative size-full grid gap-4 py-14 justify-center content-center text-center"
         @click="(editing !== -1 && categoryEntity.id) && (editing = categoryEntity.id)">
         <div v-if="!editable"
            class="absolute size-full inset-0 flex text-2xl z-20 bg-slate-700/90 opacity-0 hover:opacity-100 cursor-pointer transition-all">
            <span class="block m-auto">Click To Edit</span>
         </div>
         <span class="text-slate-400">{{ categoryEntity.slug }}</span>
         <PrimeFloatLabel variant="on">
            <PrimeInputText :id="`${ruId}-title`" type="text" v-model.trim="categoryEntity.nameRu" class="!text-base"
               :disabled="!editable" />
            <label class="!text-base" :for="`${ruId}-title`">Title Ru</label>
         </PrimeFloatLabel>
         <PrimeFloatLabel variant="on">
            <PrimeInputText :id="`${enId}-title`" type="text" v-model.trim="categoryEntity.nameEn" class="!text-base"
               :disabled="!editable" />
            <label class="!text-base" :for="`${enId}-title`">Title En</label>
         </PrimeFloatLabel>
         <div class="flex justify-evenly" v-if="editable">
            <ButtonsMain @click="emit('delete', categoryEntity.id)"
               class="mx-auto text-xl disabled:opacity-50 disabled:cursor-not-allowed bg-red-500">
               Delete
            </ButtonsMain>
            <ButtonsMain v-if="hasBeenEdited" @click="save()"
               class="mx-auto text-xl disabled:opacity-50 disabled:cursor-not-allowed bg-green-500">
               Save
            </ButtonsMain>
         </div>
      </div>
   </div>
</template>

<style scoped></style>