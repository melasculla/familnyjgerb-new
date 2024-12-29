<script setup lang="ts">
const model = defineModel<string>({ default: '' })
const hasError = ref<boolean>(false)

const validate = () => {
   hasError.value = false

   const regex = /^[a-zA-Zа-яА-ЯёЁ'][a-zA-Z-а-яА-ЯёЁ' ]+[a-zA-Zа-яА-ЯёЁ']?$/ // Name Field
   const isNameLongEnough = model.value && model.value.length > 2

   if (!regex.test(model.value) || !isNameLongEnough) {
      hasError.value = true
      return false
   }
   return true
}

watch(model, () => validate())

defineExpose({ validate })
</script>

<template>
   <div class="custom__input group name" :class="{ 'error': hasError }">
      <div>
         <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
               d="M11.428 11.4285C14.2683 11.4285 16.5709 9.126 16.5709 6.28568C16.5709 3.44536 14.2683 1.14282 11.428 1.14282C8.58769 1.14282 6.28516 3.44536 6.28516 6.28568C6.28516 9.126 8.58769 11.4285 11.428 11.4285Z"
               stroke="currentColor" stroke-width="2.28571" stroke-linecap="round" stroke-linejoin="round" />
            <path
               d="M7.99972 28.5714H1.14258V25.1428C1.16077 23.4006 1.62024 21.6915 2.47806 20.175C3.33588 18.6585 4.56406 17.3842 6.04789 16.4711C7.53172 15.558 9.22278 15.0358 10.9631 14.9534C12.7034 14.871 14.4363 15.2311 15.9997 16M30.8569 19.4285L20.0912 30.1942L15.2226 30.8571L15.9083 25.9885L26.6512 15.2228L30.8569 19.4285Z"
               stroke="currentColor" stroke-width="2.28571" stroke-linecap="round" stroke-linejoin="round" />
         </svg>
         <input type="text" name="name" v-model.trim="model" :placeholder="$t('form.fields.name')">
         <IconsInfo v-if="hasError" />
      </div>
      <ErrorInput :condition="hasError">
         {{ $t('form.errors.main') }}
      </ErrorInput>
   </div>
</template>

<style scoped lang="postcss"></style>