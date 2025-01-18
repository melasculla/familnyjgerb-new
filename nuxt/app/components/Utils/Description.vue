<script setup lang="ts">
const description = defineModel<string | null>({ default: null })
const validatedDescription = computed<string | null>({
   get: () => description.value,
   set: (newValue) => {
      if (!newValue || !newValue.length)
         return description.value = null

      return description.value = validate(newValue)
   },
})

const error = ref<string>('')
const validate = (string: string): string => {
   error.value = ''

   if (string.length <= 15 && string.length > 0)
      error.value = 'Description must be at least 15 characters long'

   return string.replace(/\s+/g, ' ')
}
</script>

<template>
   <input type="text" v-model.trim="validatedDescription" placeholder="Description">
   <UtilsError :error="error" />
</template>

<style scoped></style>