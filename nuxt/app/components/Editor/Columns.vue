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
   <component class="mx-auto" v-else-if="block.type === 'customButton'" v-bind="block.data.props"
      :is="block.data.name ? buttons[block.data.name as keyof typeof buttons] : buttons.Main">
      {{ block.data.props.text }}
   </component>
</template>

<style scoped></style>