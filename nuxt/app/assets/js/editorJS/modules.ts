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
      this.config = {}
   }

   render() {
      this.wrapper.classList.add('custom-button-tool')
      this.wrapper.contentEditable = `false`;
      this.wrapper.style.outline = '2px solid orange'
      this.wrapper.style.outlineOffset = '8px'
      this.wrapper.style.borderRadius = '20px'
      this.wrapper.style.padding = '1rem'
      this.wrapper.style.margin = '0.75rem auto';
      this.wrapper.style.padding = '0.5rem';
      this.wrapper.style.display = 'grid';
      this.wrapper.style.gap = '1rem';
      this.wrapper.style.textAlign = 'center';

      this.createField('Текст', 'text', this.data.props.text)
      this.createField('Ссылка', 'link', this.data.props.href)
      this.createField('Форма заявки', 'form', this.data.props.form, 'checkbox')

      return this.wrapper;
   }

   private createField(text: string, customClass: string, value: string, type: 'input' | 'checkbox' = 'input') {
      const wrapper = document.createElement('div')
      wrapper.style.display = 'flex'
      wrapper.style.gap = '.5rem'
      wrapper.style.justifyContent = 'center'
      wrapper.style.fontSize = '1.7rem'

      const input = document.createElement('input')
      if (type === 'input')
         input.value = value

      if (type === 'checkbox') {
         input.type = 'checkbox'
         // @ts-ignore
         input.checked = value
      }

      const label = document.createElement('label')
      label.innerHTML = `${text}: `
      wrapper.appendChild(label)
      wrapper.appendChild(input)
      input.style.padding = '0.2rem 0.5rem'
      input.style.borderRadius = '0.5rem'
      input.style.width = type === 'input' ? '100%' : '4rem'
      input.style.textAlign = 'center'
      input.style.border = '2px solid #fca5a5'
      input.classList.add(customClass)

      this.wrapper.appendChild(wrapper)
   }

   async rendered() {
      if (this.config.rendered)
         return

      const buttonComponents = import.meta.glob('@/components/Buttons/*.vue') as Record<string, any> // , { eager: true }

      const buttonList = document.createElement('div');
      buttonList.style.display = 'flex';
      buttonList.style.flexWrap = 'wrap';
      buttonList.style.gap = '1rem';
      buttonList.style.justifyContent = 'center'

      const outline = '2px solid red'

      for (const path in buttonComponents) {
         const name = path.split('/').pop()?.replace('.vue', '');
         const buttonWrapper = document.createElement('div');
         buttonWrapper.classList.add('button-preview')

         this.renderButtonComponent((await buttonComponents[path]()).default, buttonWrapper, name)

         buttonWrapper.style.outline = this.data.name === name ? outline : ''
         buttonWrapper.style.outlineOffset = '6px'
         buttonWrapper.onclick = async () => {
            this.data.name = name

            for (const item of buttonList.querySelectorAll('div.button-preview') as NodeListOf<HTMLDivElement>) {
               item.style.outline = ''
            }
            buttonWrapper.style.outline = outline
         };

         buttonList.appendChild(buttonWrapper);
      }

      this.config.rendered = true
      this.wrapper.appendChild(buttonList);
   }

   private async renderButtonComponent(passedComponent: ConcreteComponent, wrapper: Element, text?: string) {
      renderComponent(
         h(passedComponent, {
            // 'onUpdate:props': (newProps: Record<string, any>) => {
            //    this.data.props = newProps
            // }
         }, { default: () => text ?? this.data.props.text }),
         wrapper
      )
   }

   save() {
      const text = (this.wrapper.querySelector('input.text') as HTMLInputElement)?.value
      const href = (this.wrapper.querySelector('input.link') as HTMLInputElement)?.value
      const form = (this.wrapper.querySelector('input.form') as HTMLInputElement)?.checked

      return {
         name: this.data.name,
         props: {
            text: text || this.data.props.text,
            href: href || this.data.props.href,
            form
         }
      }
   }

   // destroy() {
   //    renderComponent(null, this.wrapper)
   // }
}

export default CustomButtonTool;