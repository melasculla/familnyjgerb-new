import handlebars from 'handlebars';

export abstract class EmailNotificationDTO {
   public to: string
   public from: string | undefined
   public subject: string
   public plainText: string
   public html: string
   private htmlTemplate: string
   private data: Record<any, any>

   constructor(
      to: string = 'info@art-studiott.com',
      subject: string,
      plainText: string,
      htmlTemplate: string,
      data: Record<any, any>,
      from?: string
   ) {
      this.to = to
      this.from = from
      this.subject = subject
      this.plainText = plainText
      this.htmlTemplate = htmlTemplate
      this.data = data
      this.html = this.compileHTML(this.htmlTemplate)
   }

   private compileHTML(template: string): string {
      return handlebars.compile(template)(this.data)
   }
}