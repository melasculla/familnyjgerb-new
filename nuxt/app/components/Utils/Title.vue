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

   if (string.length <= 4)
      errors!.title = 'Title must be at least 5 characters long'

   if (['list', 'monograms', 'gerbs', 'create'].includes(slug.value) || slug.value.includes('__')) {
      errors!.title = 'Slug cannot be like this'
   }

   return string.replace(/\s+/g, ' ')
}

const id = useId()
</script>

<template>
   <div class="[&[class*='contents']_.slug]:row-start-2 [&[class*='contents']_.slug]:col-span-full">
      <PrimeFloatLabel variant="on">
         <PrimeInputText :id="`${id}-title`" type="text" v-model.trim="validatedTitle" class="!text-base" />
         <label class="!text-base" :for="`${id}-title`">Title</label>
      </PrimeFloatLabel>
      <p class="flex flex-wrap gap-4 mt-4 items-center slug">
         <span class="flex flex-shrink-0 gap-2 items-center text-sm cursor-pointer [&_*]:cursor-pointer">
            <label class="select-none" :for="`${id}-slug`">Edit slug?</label>
            <input class="size-5" :id="`${id}-slug`" type="checkbox" v-model="editSlug">
         </span>
         <span class="text-xs text-slate-500">{{ slug }}</span>
      </p>
      <UtilsError :error="errors!.title || errors!.slug" />
   </div>
</template>

<style scoped></style>