<script setup lang="ts">
const { provideKey } = defineProps<{
   provideKey: keyof typeof PROVIDE_KEYS
}>()

const errors = inject(PROVIDE_KEYS[provideKey])

const description = defineModel<string | null>({ default: null })
const validatedDescription = computed<string | null>({
   get: () => description.value,
   set: (newValue) => {
      if (!newValue || !newValue.length)
         return description.value = null

      return description.value = validate(newValue)
   },
})

const validate = (string: string): string => {
   errors!.description = ''

   if (string.length <= 15 && string.length > 0)
      errors!.description = 'Description must be at least 15 characters long'

   return string.replace(/\s+/g, ' ')
}

const id = useId()
</script>

<template>
   <div>
      <PrimeFloatLabel variant="on">
         <PrimeInputText :id="`${id}-title`" type="text" v-model.trim="validatedDescription" class="!text-base" />
         <label class="!text-base" :for="`${id}-title`">Description</label>
      </PrimeFloatLabel>
      <UtilsError :error="errors!.description" />
   </div>
</template>

<style scoped></style>