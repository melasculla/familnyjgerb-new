<script setup lang="ts">
import slugify from '@sindresorhus/slugify'

const emit = defineEmits<{
   'delete': [id?: number]
   'saved': [Category]
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

if (!categoryEntity.id)
   editing.value = -1

const ruId = useId()
const enId = useId()

const toast = useVueToast()
const loading = ref<boolean>(false)

const save = async () => {
   loading.value = true
   const savingToast = toast.loading('Saving category...')

   if (!categoryEntity.slug && !categoryEntity.slug.length) {
      if (categoryEntity.nameRu)
         categoryEntity.slug = slugify(categoryEntity.nameRu)
      else if (categoryEntity.nameEn)
         categoryEntity.slug = slugify(categoryEntity.nameEn)
   }

   const result = await $fetch<{ category: Category }>(categoryEntity.id ? routesList.api.categories.edit : routesList.api.categories.create, {
      method: categoryEntity.id ? 'PATCH' : 'POST',
      body: {
         id: categoryEntity.id,
         slug: categoryEntity.id ? undefined : categoryEntity.slug,
         nameRu: categoryEntity.nameRu,
         nameEn: categoryEntity.nameEn,
      }
   }).catch(async err => {
      loading.value = false
      await nextTick()
      const zodField = (err?.data?.data?.issues && err?.data?.data?.issues[0]?.path) ? `(${err?.data?.data?.issues[0]?.path[0]}) ` : ''
      toast.update(savingToast, {
         render: zodField + (err?.data?.message || 'Category wasn\'t saved'),
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
   })

   if (!result)
      return

   loading.value = false
   await nextTick()
   toast.update(savingToast, {
      render: 'Category saved',
      autoClose: true,
      closeOnClick: true,
      type: 'success',
      isLoading: false
   })

   editing.value = null

   data.value = result.category
   categoryEntity.id = result.category.id
   categoryEntity.slug = result.category.slug
   categoryEntity.nameRu = result.category.nameRu
   categoryEntity.nameEn = result.category.nameEn

   emit('saved', categoryEntity as Category)
}


const confirm = useConfirm()
const remove = async () => {
   if (!categoryEntity.id) {
      editing.value = null
      emit('delete', categoryEntity.id)
      return
   }

   loading.value = true
   const savingToast = toast.loading('Deleting category...')

   try {
      await $fetch(routesList.api.categories.delete, {
         method: 'DELETE',
         body: { id: categoryEntity.id }
      })

      loading.value = false
      await nextTick()
      toast.update(savingToast, {
         render: 'Category deleted',
         autoClose: true,
         closeOnClick: true,
         type: 'success',
         isLoading: false
      })

      emit('delete', categoryEntity.id)
   } catch (err: any) {
      loading.value = false
      await nextTick()
      const zodField = (err?.data?.data?.issues && err?.data?.data?.issues[0]?.path) ? `(${err?.data?.data?.issues[0]?.path[0]}) ` : ''
      toast.update(savingToast, {
         render: zodField + (err?.data?.message || 'Category wasn\'t deleted'),
         autoClose: true,
         closeOnClick: true,
         type: 'error',
         isLoading: false
      })
   }
}
</script>

<template>
   <div>
      <div class="relative size-full grid gap-4 py-14 justify-center content-center text-center"
         @click="(editing !== -1 && categoryEntity.id) && (editing = categoryEntity.id)">
         <div v-if="!editable" :class="{ '!cursor-not-allowed': editing === -1 }"
            class="select-none absolute size-full inset-0 flex text-2xl z-20 bg-slate-700/90 opacity-0 hover:opacity-100 cursor-pointer transition-all rounded-lg">
            <span class="block m-auto text-white">
               {{ editing === -1 ? 'Save new Category first' : 'Click To Edit' }}
            </span>
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
            <ButtonsMain @click="confirm.require({
               message: 'Are you sure you want to remove category?',
               header: 'Confirmation',
               accept: () => remove(),
               icon: 'pi pi-exclamation-triangle',
               acceptProps: {
                  severity: 'danger',
                  icon: 'pi pi-trash',
                  variant: 'outlined',
                  size: 'large'
               },
            })" class="mx-auto text-xl disabled:opacity-50 disabled:cursor-not-allowed bg-red-500">
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