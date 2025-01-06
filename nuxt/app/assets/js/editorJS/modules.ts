class CustomButtonTool {
   static get toolbox() {
      return {
         title: 'Button',
         icon: '<svg>...</svg>', // Add your icon here
      };
   }

   public data: any
   public config: any
   public wrapper: any

   constructor({ data, api, config }: any) {
      this.data = data || {};
      this.config = config;
      this.wrapper = null;
   }

   render() {
      // Create the wrapper for the button
      this.wrapper = document.createElement('div');
      this.wrapper.contentEditable = false;

      // Render the button using the data or default state
      const buttonName = this.data.name || 'div';
      const slotContent = this.data.slot || 'Default Text';

      this.wrapper.innerHTML = `
       <div class="editorjs-button-wrapper">
         <component is="${buttonName}">${slotContent}</component>
       </div>
     `;



      return this.wrapper;
   }

   save(blockContent: any) {
      // Extract and save data to JSON
      const buttonName = this.data.name || 'ButtonsMain';
      const slotContent = this.wrapper.querySelector('component').innerHTML;

      return {
         name: buttonName,
         slot: slotContent,
      };
   }
}

export default CustomButtonTool;