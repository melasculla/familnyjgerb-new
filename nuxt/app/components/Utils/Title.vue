<script setup lang="ts">
import slugify from '@sindresorhus/slugify'

const { isEdit, provideKey } = defineProps<{
   isEdit: boolean
   provideKey: keyof typeof PROVIDE_KEYS
}>()

const errors = inject(PROVIDE_KEYS[provideKey])

const title = defineModel<string>({ default: '' })
const slug = defineModel<string>('slug', { default: '' })

const initalSlug = JSON.parse(JSON.stringify(slug.value)) as string
const editSlug = ref<boolean>(!isEdit || false)
watch(editSlug, newValue => {
   if (!newValue)
      slug.value = initalSlug
   else
      validatedTitle.value = title.value
})

const validatedTitle = computed<string>({
   get: () => title.value,
   set: (newValue) => {
      if (!newValue) {
         slug.value = ''
         return title.value = ''
      }

      if (editSlug.value)
         slug.value = slugify(newValue)
      else
         slug.value = initalSlug

      nextTick(() => title.value = validate(newValue))
   },
})

const validate = (string: string): string => {
   errors!.title = ''
   errors!.slug = ''

   if (string.length <= 3)
      errors!.title = 'Title must be at least 4 characters long'

   if (['list', 'monograms', 'gerbs', 'create'].includes(slug.value)) {
      errors!.title = 'Slug cannot be like this'
   }

   return string.replace(/\s+/g, ' ')
}
</script>

<template>
   <div>
      <input type="text" v-model.trim="validatedTitle" placeholder="Title">
      <p class="flex gap-4 items-center">
         {{ slug }}
         <span class="flex gap-2 items-center">
            Edit slug? <input class="size-6" type="checkbox" v-model="editSlug">
         </span>
      </p>
      <UtilsError :error="errors!.title || errors!.slug" />
   </div>
</template>

<style scoped></style>