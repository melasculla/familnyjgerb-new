<script setup lang="ts">
import type { FormName, FormPhone, FormEmail, FormPolicy } from '#components'

const { short } = defineProps<{
   short?: boolean
}>()

const _name = ref<InstanceType<typeof FormName>>()
const _phone = ref<InstanceType<typeof FormPhone>>()
const _email = ref<InstanceType<typeof FormEmail>>()
const _policy = ref<InstanceType<typeof FormPolicy>>()
const formContainer = ref<HTMLFormElement>()

const isSending = ref<boolean>(false)
const policy = ref<boolean>(false)

interface Form {
   name: string
   phone: string
   phoneCountry?: string,
   email?: string
   message?: string | null
   favourites?: Array<{ title: string, link: string }>
}

const form = useState<Form>('FormData', () => ({
   name: '',
   phone: '',
   phoneCountry: '',
   email: '',
   message: null,
   favourites: undefined,
}))

type ServicesList = {
   model: 'dev' | 'logoDesign' | 'gerbs' | 'monograms'
}[]
const servicesList: ServicesList = [
   { model: 'dev' },
   { model: 'logoDesign' },
   { model: 'gerbs' },
   { model: 'monograms' },
]
const services = ref({
   dev: false,
   logoDesign: false,
   gerbs: false,
   monograms: false,
})

onMounted(() => {
   const inputs = formContainer.value?.querySelectorAll('input, textarea') as NodeListOf<HTMLInputElement>

   formContainer.value?.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || !inputs)
         return

      for (const [index, input] of inputs.entries()) {
         const nextInputID = index + 1
         const isInArray = nextInputID >= 0 && nextInputID < inputs.length
         const isLastChild = index !== inputs.length

         if (document.activeElement === input && isInArray && isLastChild) {
            inputs[nextInputID]!.focus()
            break
         }
      }
   })
})

const handleSubscribe = async (): Promise<void> => {
   const isNameValid = _name.value?.validate()
   const isEmailValid = _email.value?.validate()

   if (!isNameValid || !isEmailValid)
      return

   if (!policy.value) {
      _policy.value && _policy.value.validate()
      return
   }

   // Send here
   const body = {
      name: form.value.name,
      email: form.value.email,
      services: services.value
   }

   try {
      await $fetch('/api/mail/send', {
         method: 'POST',
         body
      })
      alert('Message send successfully')
   } catch (err: any) {
      alert(err.message)
   }
}

const handleForm = async (attachFavourites: boolean): Promise<boolean> => {
   const isNameValid = _name.value?.validate()
   const isPhoneValid = _phone.value?.validate()
   const isEmailValid = _email.value?.validate()

   if (!isNameValid || !isPhoneValid || !isEmailValid)
      return false

   // if (attachFavourites) {
   //    const store = usePortfolioFavouritesStore()
   //    form.value.favourites = store.list.map(item => ({ title: item.title_en ?? item.title_ru!, link: item.slug }))
   // }

   try {
      await $fetch('/api/mail/send', {
         method: 'POST',
         body: form.value
      })
      alert('Message send successfully')
   } catch (err: any) {
      alert(err.message)
   }
   return true
}

defineExpose({ handleForm })
</script>

<template>
   <div>
      <div class="form" :class="{ 'form__short': short }">
         <form @submit.prevent="handleSubscribe" class="grid gap-10" ref="formContainer">
            <div v-if="short" class="flex items-center justify-center gap-2 flex-wrap title text-center md:text-left">
               <IconsCheck class="size-6" />
               <p class="uppercase font-semibold text-base font-title">{{ $t('subscribe.title') }}</p>
               <p class="grow w-full text-center text-sm mt-2">{{ $t('subscribe.subtitle') }}</p>
            </div>
            <FormName v-model="form.name" ref="_name" class="name" />
            <FormPhone v-if="!short" v-model="form.phone" v-model:country="form.phoneCountry" ref="_phone" />
            <FormEmail v-model="form.email" ref="_email" class="email" />
            <div v-if="short"
               class="text-[#66B3FF] font-semibold text-sm text-center grid xs:grid-cols-2 xl:grid-cols-4 gap-4 xs:justify-items-center justify-around services">
               <p class="col-span-full pb-4">{{ $t('subscribe.services.title') }}</p>
               <div class="custom__checkbox" v-for="service in servicesList" :key="service.model">
                  <input type="checkbox" v-model="services[service.model]" :id="`services-${service.model}`">
                  <label :for="`services-${service.model}`">
                     <div :class="{ 'active': services[service.model] }">
                        <transition name="fade">
                           <svg width="100%" height="100%" viewBox="0 0 13 12" fill="none"
                              v-if="services[service.model]">
                              <path
                                 d="M12.501 0.246411C11.9604 -0.172339 11.2041 -0.0442138 10.8104 0.530786L5.18849 8.75579L2.09162 5.40266C1.63537 4.88391 0.869745 4.85891 0.382245 5.34641C-0.105255 5.83079 -0.130255 6.64641 0.32912 7.16204C0.32912 7.16204 4.09162 11.337 4.63224 11.7558C5.17287 12.1745 5.92912 12.0464 6.32287 11.4714L12.7697 2.04329C13.1635 1.46516 13.0416 0.662036 12.501 0.246411Z"
                                 fill="currentColor" />
                           </svg>
                        </transition>
                     </div>
                     <p>{{ $t(`subscribe.services.${service.model}`) }}</p>
                  </label>
               </div>
            </div>
            <textarea v-if="!short" class="resize-none custom__textarea" name="message" v-model="form.message"
               :placeholder="$t('form.fields.message')" />
            <FormPolicy v-if="short" v-model="policy" ref="_policy" class="flex-col policy" />
            <Button v-if="short" type="submit" :state="isSending" class="button">
               {{ $t('form.fields.send') }}
            </Button>
         </form>
      </div>
   </div>
</template>

<style scoped lang="postcss">
.form {
   &__short {
      @apply w-11/12 xl:w-[70%] max-h-[92svh] bg-[url('/bg-subscribe.webp')] bg-no-repeat bg-cover bg-top px-6 md:px-20 pt-10 pb-14 text-white overflow-y-auto;
      box-shadow: inset 5px 7px 4.5px rgba(32, 67, 183, 0.8);
      filter: drop-shadow(0px 4px 4px rgba(0, 18, 76, 0.25));

      & form {
         @apply grid-cols-4 items-center;
         grid-template-areas:
            'title title title title'
            'name name email email'
            'services services services services'
            'policy policy policy button';
      }

      & .title {
         grid-area: title;
      }

      & .name {
         @apply self-start;
         grid-area: name;
      }

      & .email {
         @apply self-start;
         grid-area: email;
      }

      & .services {
         @apply select-none;
         grid-area: services;
      }

      & .policy {
         grid-area: policy;
      }

      & .button {
         grid-area: button;
      }
   }
}

@media (max-width: 768px) {
   .form {
      &__short {
         @apply w-full h-max;

         & form {
            @apply grid-cols-2 justify-items-center;
            grid-template-areas:
               'title title'
               'name name'
               'email email'
               'services services'
               'policy policy'
               'button button';
         }
      }
   }
}
</style>