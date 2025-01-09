<script setup lang="ts">
import { Editor } from '#components'

const editor = ref<InstanceType<typeof Editor>>()
const result = ref()
const data = {
   "time": 1,
   "blocks": [
      {
         "type": "paragraph",
         "data": {
            "text": "Традиция собирать приданое для дочери, прежде чем выдать ее замуж, известна еще со времен королей, герцогов и рыцарей. Уже тогда монограмма играла важную роль в украшении многих вещей будущей невесты. Изначально символику использовали для того, чтобы отделить личные вещи от приданого девушки."
         }
      },
      {
         "type": "customButton",
         "data": {
            "name": "Main",
            props: {
               "text": "Заказать разработку монограммы",
               "href": "/nashi-kontakty"
            }
         }
      },
      {
         "type": "paragraph",
         "data": {
            "text": "<a href=\"/o-sajte/razrabotka-monogramm\">Монограмма</a> гравировалась, вышивалась, вырезалась и так далее, на всем, что ей принадлежало лично. Спустя некоторое время монограмма стала благородной символикой, которую позволить себе могли не многие. Она придавала шарм и дороговизну вещам, что в разы увеличивало стоимость и статусность приданого. Помимо этого монограмма служила украшением, многие придворные дамы вышивали личную монограмму золотыми нитями, а также создавали ювелирные украшения с символикой, которые со временем становились фамильной ценностью. "
         }
      }
   ],
   "version": "2.30.7"
}
</script>

<template>
   <div class="grid gap-6 text-center justify-items-center">
      <NuxtLink class="block text-center text-4xl mt-5" to="/blog_o_geraldike">
         Blog
      </NuxtLink>
      <button class="block mx-auto text-base text-red-500" @click="result = undefined">
         Reset
      </button>
      <button class="block mx-auto text-xl text-green-400" @click="async () => {
         result = await editor?.save()
         console.log(toRaw(result.blocks))
      }">
         Save
      </button>
      <EditorContent v-if="result" :content="result" />
      <Editor :data="data" ref="editor" class="w-10/12 mx-auto" />
   </div>
</template>

<style scoped></style>