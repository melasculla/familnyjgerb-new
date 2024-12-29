<script setup lang="ts">
const model = defineModel<string>({ default: '' })
const hasError = ref<boolean>(false)

const validate = () => {
   hasError.value = false

   const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ // Email Field

   if (!regex.test(model.value) || !model.value) {
      hasError.value = true
      return false
   }
   return true
}

watch(model, () => validate())

defineExpose({ validate })
</script>

<template>
   <div class="custom__input group email" :class="{ 'error': hasError }">
      <div>
         <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
            <path
               d="M24.666 0.333374H3.33268C1.86602 0.333374 0.666016 1.53337 0.666016 3.00004V19C0.666016 20.4667 1.86602 21.6667 3.33268 21.6667H24.666C26.1327 21.6667 27.3327 20.4667 27.3327 19V3.00004C27.3327 1.53337 26.1327 0.333374 24.666 0.333374ZM24.1327 6.00004L15.4127 11.4534C14.546 12 13.4527 12 12.586 11.4534L3.86602 6.00004C3.73232 5.92499 3.61524 5.82359 3.52187 5.70198C3.42849 5.58037 3.36077 5.44108 3.32278 5.29254C3.2848 5.14399 3.27735 4.98929 3.30089 4.83778C3.32443 4.68628 3.37846 4.54113 3.45972 4.41111C3.54099 4.28109 3.64778 4.16892 3.77365 4.08137C3.89952 3.99382 4.04184 3.93272 4.19201 3.90177C4.34218 3.87082 4.49706 3.87066 4.64729 3.9013C4.79752 3.93195 4.93997 3.99275 5.06602 4.08004L13.9993 9.66671L22.9327 4.08004C23.0587 3.99275 23.2012 3.93195 23.3514 3.9013C23.5016 3.87066 23.6565 3.87082 23.8067 3.90177C23.9569 3.93272 24.0992 3.99382 24.225 4.08137C24.3509 4.16892 24.4577 4.28109 24.539 4.41111C24.6202 4.54113 24.6743 4.68628 24.6978 4.83778C24.7213 4.98929 24.7139 5.14399 24.6759 5.29254C24.6379 5.44108 24.5702 5.58037 24.4768 5.70198C24.3835 5.82359 24.2664 5.92499 24.1327 6.00004Z"
               fill="currentColor" />
         </svg>
         <input type="text" name="email" v-model.trim="model" :placeholder="$t('form.fields.email')">
         <IconsInfo v-if="hasError" />
      </div>
      <ErrorInput :condition="hasError">
         {{ $t('form.errors.main') }}
      </ErrorInput>
   </div>
</template>

<style scoped lang="postcss"></style>