<script setup lang="ts">
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const model = defineModel<string>({ default: '' })
const country = defineModel<string>('country', { default: '' })
const hasError = ref<boolean>(false)

const validate = () => {
   hasError.value = false

   const phoneNumber = parsePhoneNumberFromString(model.value)

   if (!phoneNumber || !phoneNumber.isValid()) {
      country.value = ''
      hasError.value = true
      return false
   }

   model.value = phoneNumber.formatInternational()
   country.value = phoneNumber.country!
   return true
}

watch(model, () => validate())

defineExpose({ validate })
</script>

<template>
   <div class="custom__input group phone" :class="{ 'error': hasError }">
      <div>
         <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
               d="M3.06389 0.830369C3.34822 0.546464 3.68965 0.326227 4.06554 0.184253C4.44142 0.0422798 4.84319 -0.0181881 5.24422 0.00685675C5.64524 0.0319016 6.03636 0.141887 6.39167 0.329525C6.74697 0.517163 7.05834 0.778168 7.30514 1.09524L10.222 4.84249C10.7566 5.52987 10.9451 6.42524 10.7339 7.27024L9.84502 10.829C9.79938 11.0133 9.80202 11.2063 9.85269 11.3893C9.90335 11.5724 10.0003 11.7392 10.1343 11.8739L14.1269 15.8665C14.2617 16.0007 14.4288 16.0978 14.6122 16.1485C14.7955 16.1992 14.9888 16.2017 15.1734 16.1557L18.7305 15.2669C19.1476 15.1632 19.5827 15.1554 20.0032 15.2441C20.4236 15.3327 20.8186 15.5155 21.1583 15.7787L24.9055 18.694C26.2526 19.7421 26.3761 21.7327 25.1704 22.9369L23.4901 24.6171C22.2876 25.8196 20.4904 26.3477 18.815 25.7579C14.5261 24.2508 10.6324 21.7957 7.42377 18.5754C4.20362 15.3672 1.74854 11.4741 0.241265 7.18574C-0.346985 5.51199 0.18114 3.71312 1.38364 2.51062L3.06389 0.830369Z"
               fill="currentColor" />
         </svg>
         <input type="text" name="phone" v-model.trim="model" :placeholder="$t('form.fields.phone')">
         <IconsInfo v-if="hasError" />
      </div>
      <ErrorInput :condition="hasError">
         {{ $t('form.errors.main') }}
      </ErrorInput>
   </div>
</template>

<style scoped lang="postcss"></style>