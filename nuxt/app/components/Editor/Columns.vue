<script setup lang="ts">
import { ButtonsMain, ButtonsOrder } from '#components'

defineProps<{
   block: {
      id?: string | number
      type: string
      data: Record<any, any>
      tunes?: { [name: string]: any }
   }
   child?: boolean
}>()

const buttons = {
   'Main': ButtonsMain,
   'Order': ButtonsOrder
}

const openForm = () => {
   // TODO: open form
}
</script>

<template>
   <EditorTitle v-if="block.type === 'header'" :block="block.data" :tunes="block.tunes" />
   <EditorText v-else-if="block.type === 'paragraph'" :block="block.data" :tunes="block.tunes" />
   <EditorImage v-else-if="block.type === 'image'" :block="block.data" :child="child" />
   <EditorList v-else-if="block.type === 'list'" :block="block.data" />
   <EditorCheckList v-else-if="block.type === 'checklist'" :block="block.data" />
   <EditorQuote v-else-if="block.type === 'quote'" :block="block.data" />
   <EditorEmbed v-else-if="block.type === 'embed'" :block="block.data" />
   <EditorAlert v-else-if="block.type === 'alert'" :block="block.data" />
   <div v-else-if="block.type === 'delimiter'" :class="block.data?.size ? '' : 'my-8'" :style="block.data?.size && {
      marginTop: block.data.size.replace('size-', ''),
      marginBottom: block.data.size.replace('size-', ''),
   }" />
   <component class="mx-auto" v-else-if="block.type === 'customButton'" @click="block.data.props?.form && openForm()"
      v-bind="{ to: block.data.props?.form ? undefined : block.data.props?.href }"
      :is="block.data.name ? buttons[block.data.name as keyof typeof buttons] : buttons.Main">
      {{ block.data.props.text }}
   </component>
</template>

<style scoped></style>