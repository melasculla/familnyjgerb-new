<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
const hasError = ref<boolean>(false)

const localPath = useLocalePath()

const label = ref<string>('')
onMounted(() => {
   label.value = String(Math.floor(Math.random() * 9e15))
})

const validate = () => {
   hasError.value = false

   if (!model.value) {
      hasError.value = true
      return false
   }
   return true
}

defineExpose({ validate })
</script>

<template>
   <div class="flex flex-wrap justify-between gap-2">
      <div class="custom__checkbox" :class="{ 'error': hasError }">
         <input type="checkbox" name="policy" v-model="model" @change="validate" :id="`policy_input-${label}`">
         <label :for="`policy_input-${label}`">
            <div :class="{ 'active': model }">
               <transition name="fade">
                  <svg width="100%" height="100%" viewBox="0 0 13 12" fill="none" v-if="model">
                     <path
                        d="M12.501 0.246411C11.9604 -0.172339 11.2041 -0.0442138 10.8104 0.530786L5.18849 8.75579L2.09162 5.40266C1.63537 4.88391 0.869745 4.85891 0.382245 5.34641C-0.105255 5.83079 -0.130255 6.64641 0.32912 7.16204C0.32912 7.16204 4.09162 11.337 4.63224 11.7558C5.17287 12.1745 5.92912 12.0464 6.32287 11.4714L12.7697 2.04329C13.1635 1.46516 13.0416 0.662036 12.501 0.246411Z"
                        fill="currentColor" />
                  </svg>
               </transition>
            </div>
            <p class="text-balance text-center md:text-left">{{ $t('form.fields.policy-1') }} <NuxtLink
                  :to="localPath(routesList.client.policy)">{{ $t('form.fields.policy-2') }}</NuxtLink>
            </p>
         </label>
      </div>
      <ErrorInput :condition="hasError">
         {{ $t('form.errors.policy') }}
      </ErrorInput>
   </div>
</template>

<style scoped lang="postcss">
.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}
</style>