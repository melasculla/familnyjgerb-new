<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
   <div class="custom__checkbox">
      <input type="checkbox" name="favorites" v-model="model" id="favorites_input">
      <label for="favorites_input">
         <div :class="{ 'active': model }">
            <transition name="fade">
               <svg width="100%" height="100%" viewBox="0 0 13 12" fill="none" v-if="model">
                  <path
                     d="M12.501 0.246411C11.9604 -0.172339 11.2041 -0.0442138 10.8104 0.530786L5.18849 8.75579L2.09162 5.40266C1.63537 4.88391 0.869745 4.85891 0.382245 5.34641C-0.105255 5.83079 -0.130255 6.64641 0.32912 7.16204C0.32912 7.16204 4.09162 11.337 4.63224 11.7558C5.17287 12.1745 5.92912 12.0464 6.32287 11.4714L12.7697 2.04329C13.1635 1.46516 13.0416 0.662036 12.501 0.246411Z"
                     fill="currentColor" />
               </svg>
            </transition>
         </div>
         <p>{{ $t('form.fields.favorites-1') }} <NuxtLink :to="routesList.favorites">{{ $t('form.fields.favorites-2') }}
            </NuxtLink> {{ $t('form.fields.favorites-3') }}</p>
      </label>
   </div>
</template>

<style scoped lang="postcss"></style>