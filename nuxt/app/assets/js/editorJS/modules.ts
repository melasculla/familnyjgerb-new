import { render as renderComponent, type ConcreteComponent } from "vue";

class CustomButtonTool {
   static get toolbox() {
      return {
         title: 'Button',
         icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M20 20.5c0 .8-.7 1.5-1.5 1.5H13c-.4 0-.7-.1-1-.4l-4-4.2l.7-.8c.2-.2.5-.3.8-.3h.2L12 18V9c0-.6.4-1 1-1s1 .4 1 1v4.5l1.2.1l3.9 2.2c.5.2.9.8.9 1.3zM20 2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h4v-2H4V4h16v8h-2v2h2c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2"/></svg>',
      };
   }

   public data: any
   public config: any
   public wrapper: HTMLDivElement

   constructor({ data }: { data: Record<any, any> }) {
      this.data = Object.keys(data).length ? data : { name: 'Main', props: { text: '', href: '/blog_o_geraldike' } }
      this.wrapper = document.createElement('div');
   }

   render() {
      this.wrapper.contentEditable = `false`;
      this.wrapper.style.outline = '1px solid orange'
      this.wrapper.style.borderRadius = '20px'
      this.wrapper.style.padding = '1rem'
      this.wrapper.classList.add('my-3', 'p-2', 'text-base', 'grid', 'gap-4', 'text-center')

      const textDiv = document.createElement('div')
      textDiv.classList.add('flex', 'flex-shrink-0', 'gap-2', 'items-center')
      const textInput = document.createElement('input')
      textInput.value = this.data.props.text
      const textLabel = document.createElement('label')
      textLabel.innerHTML = 'Текст: '
      textDiv.appendChild(textLabel)
      textDiv.appendChild(textInput)
      textInput.classList.add('px-2', 'py-1.5', 'rounded-lg', 'w-full', 'text-center', 'border-2', 'border-red-300', 'text')
      this.wrapper.appendChild(textDiv)

      const hrefDiv = document.createElement('div')
      hrefDiv.classList.add('flex', 'flex-shrink-0', 'gap-2', 'items-center')
      const hrefInput = document.createElement('input')
      hrefInput.value = this.data.props.href
      const hrefLabel = document.createElement('label')
      hrefLabel.innerHTML = 'Ссылка: '
      hrefDiv.appendChild(hrefLabel)
      hrefDiv.appendChild(hrefInput)
      hrefInput.classList.add('px-2', 'py-1.5', 'rounded-lg', 'w-full', 'text-center', 'border-2', 'border-red-300', 'link')
      this.wrapper.appendChild(hrefDiv)

      return this.wrapper;
   }

   async rendered() {
      const buttonComponents = import.meta.glob('@/components/Buttons/*.vue') as Record<string, any> // , { eager: true }

      const buttonList = document.createElement('div');
      const title = document.createElement('h2')
      title.style.flexGrow = '1'
      title.style.flexShrink = '0'
      title.style.width = '100%'
      title.innerHTML = 'Choose button';
      buttonList.appendChild(title)
      buttonList.style.display = 'flex';
      buttonList.style.flexWrap = 'wrap';
      buttonList.style.gap = '1rem';
      buttonList.style.justifyContent = 'center'

      for (const path in buttonComponents) {
         const name = path.split('/').pop()?.replace('.vue', '');
         const button = document.createElement('button');

         button.textContent = `${name}`;
         button.style.padding = '.5rem 1rem';
         button.style.borderRadius = '20px';
         button.style.outline = this.data.name === name ? '1px solid red' : ''
         button.onclick = async () => {
            this.data.name = name
            for (const item of buttonList.querySelectorAll('button')) {
               item.style.outline = ''
            }
            button.style.outline = '1px solid red'
            // const component = (await buttonComponents[path]()).default;
         };

         buttonList.appendChild(button);
      }

      this.wrapper.appendChild(buttonList);

      // const preview = document.createElement('div');
      // preview.id = 'button-preview';
      // this.wrapper.appendChild(preview);
   }

   save() {
      const text = (this.wrapper.querySelector('input.text') as HTMLInputElement)?.value
      const href = (this.wrapper.querySelector('input.link') as HTMLInputElement)?.value

      return {
         name: this.data.name,
         props: {
            text: text || this.data.props.text,
            href: href || this.data.props.href
         }
      }
   }

   // private async renderButtonComponent(passedComponent: ConcreteComponent) {
   //    // const { vueApp } = useNuxtApp();

   //    renderComponent(
   //       h(passedComponent, {
   //          ...this.data.props,
   //          editor: true,
   //          'onUpdate:props': (newProps: Record<string, any>) => {
   //             this.data.props = newProps
   //          }
   //       }),
   //       this.wrapper
   //    )
   // }

   // destroy() {
   //    renderComponent(null, this.wrapper)
   // }
}

export default CustomButtonTool;