<script setup lang="ts">
const error = ref<string>('')

const model = defineModel<string | null>()
const keys = ref<string[]>([])

if (model.value)
   keys.value = model.value.split(', ')

const addKey = (e: KeyboardEvent) => {
   if (e.key !== 'Enter' && e.key !== ',')
      return

   e.preventDefault()

   const target = e.target as HTMLInputElement
   const value = target.value.replaceAll(',', '').trim()
   error.value = ''

   if (!value) {
      error.value = 'Key cannot be empty'
      return
   }

   if (keys.value.includes(value)) {
      error.value = 'This key already exists'
      return
   }

   keys.value.push(value)
   model.value = keys.value.join(', ')
   target.value = ''
}
const removeKey = (key: string) => model.value = (keys.value = keys.value.filter(item => item !== key)).join(', ')
</script>

<template>
   <div>
      <div class="flex flex-wrap gap-2">
         <div v-for="item in keys" class="rounded-lg bg-slate-300 px-2 py-1 cursor-pointer" @click="removeKey(item)" title="Click to delete">
            {{ item }}
         </div>
         <input v-if="keys.length < 20" class="min-w-0" type="text" placeholder="Add key"
            title="press enter or , to add new key" @keydown="addKey">
      </div>
      <UtilsError :error="error" />
   </div>
</template>

<style scoped></style>