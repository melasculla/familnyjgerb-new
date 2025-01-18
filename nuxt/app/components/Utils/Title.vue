<script setup lang="ts">
import slugify from '@sindresorhus/slugify'

const title = defineModel<string>({ default: '' })
const slug = defineModel<string>('slug', { default: '' })
const validatedTitle = computed<string>({
   get: () => title.value,
   set: (newValue) => {
      if (!newValue) {
         slug.value = ''
         return title.value = ''
      }

      slug.value = slugify(newValue)
      return title.value = validate(newValue)
   },
})

const error = ref<string>('')
const validate = (string: string): string => {
   error.value = ''

   if (string.length <= 3)
      error.value = 'Title must be at least 4 characters long'

   return string.replace(/\s+/g, ' ')
}
</script>

<template>
   <input type="text" v-model.trim="validatedTitle" placeholder="Title">
   {{ slug }}
   <UtilsError :error="error" />
</template>

<style scoped></style>