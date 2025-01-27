<script setup lang="ts">
const error = ref<string>('')

const model = defineModel<string | null>()
const keys = ref<string[]>([])
const lastDeleted = ref<string>('')

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
const removeKey = (key: string) => {
   lastDeleted.value = key
   model.value = (keys.value = keys.value.filter(item => item !== key)).join(', ')
}
const restoreKey = () => {
   keys.value.push(lastDeleted.value)
   model.value = keys.value.join(', ')
   lastDeleted.value = ''
}
</script>

<template>
   <div>
      <div class="flex flex-wrap items-center gap-4 md:gap-2 relative">
         <transition-group name="list">
            <div v-for="item in keys" :key="item"
               class="rounded-lg bg-slate-300 px-6 py-4 md:px-2 md:py-1 cursor-pointer" @click="removeKey(item)"
               title="Click to delete">
               {{ item }}
            </div>
         </transition-group>
         <div class="flex flex-shrink-0 gap-2 flex-wrap">
            <PrimeInputText v-if="keys.length < 20" class="min-w-0 !text-sm" type="text" placeholder="Add key"
               title="press enter or , to add new key" @keydown="addKey" />
            <svg v-if="lastDeleted" class="size-10 cursor-pointer" viewBox="0 0 14 14" @click="restoreKey()">
               <path fill="currentColor" fill-rule="evenodd"
                  d="M6.545.998a1 1 0 0 0 0 2h2.728a2.638 2.638 0 0 1 0 5.275H4.817V6.545a1 1 0 0 0-1.707-.707L.384 8.564a1 1 0 0 0-.22 1.09q.073.18.218.327l2.728 2.728a1 1 0 0 0 1.707-.707v-1.729h4.456a4.638 4.638 0 1 0 0-9.275z"
                  clip-rule="evenodd" />
            </svg>
         </div>
         <!-- <input v-if="keys.length < 20" class="min-w-0" type="text" placeholder="Add key"
            title="press enter or , to add new key" @keydown="addKey"> -->
      </div>
      <UtilsError class="text-center mt-4 *:text-lg" :error="error" />
   </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
   transition: all 400ms ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: scale(0);
}

.list-leave-active {
   position: absolute;
}
</style>